---
title: "AI Agent Package Manager Nasıl Çalışır? RoleCraft'ın Mimarisi"
date: "2026-08-17"
slug: "ai-agent-package-manager-nasil-calisir"
description: "86+ AI agent'ı destekleyen bir package manager nasıl inşa edilir? Agent tespiti, güvenlik skorlaması, MCP yönetimi ve rollback mekanizması."
tags: ["AI", "CLI", "Node.js", "MCP", "Yazılım Mimarisi"]
image: "/blog/ai_agent_package_manager_cover.webp"
---

Merhaba,

İlk yazım olan [Sıfır Bağımlılıkla CLI Nasıl Yazılır? RoleCraft'ın Mimarisi](https://sametcelikbicak.com/blog/sifir-bagimlilikla-cli-nasil-yazilir) ve sonrasındaki [200'den 1013 Teste: RoleCraft'ta Test Stratejisi](https://sametcelikbicak.com/blog/200den-1013-teste-test-stratejisi) içeriklerinden sonra şimdi sırada mimari yaklaşımın nasıl olduğunu anlattığım içeirğim var.

RoleCraft başlangıçta çok basitti: SKILL.md dosyalarını AI agent'larının dizinlerine kopyalayan bir araç. Bugün ise 86 agent'ı destekleyen, kaynak çözümleme (local / GitHub / npm), güvenlik skorlaması, MCP sunucu yönetimi ve rollback mekanizması olan tam bir package manager'a dönüştü.

Bu yazıda bu dönüşümün teknik altyapısını anlatacağım.

## Problem: Her Agent Farklı Bir Dizine Bakıyor

Claude Code, Cursor, Windsurf, OpenCode, GitHub Copilot — her birinin skill dosyalarını okuduğu farklı bir dizin var:

| Agent          | Skill Dizini                  |
| -------------- | ----------------------------- |
| Claude Code    | `~/.claude/skills/`           |
| Cursor         | `~/.cursor/skills/`           |
| Windsurf       | `~/.codeium/windsurf/skills/` |
| OpenCode       | `~/.agents/skills/`           |
| GitHub Copilot | `./.github/skills/` (proje)   |

İyi haber: v2 ile birlikte format her yerde aynı — **SKILL.md**. Frontmatter'ında `name`, `slug`, `owner`, `description` alanları olan evrensel bir format. Yani dönüşüm sorunundan çok bir "hangi dizine kopyala" sorunumuz var. 86 agent'ın tamamı tek bir statik manifest'te tutuluyor (`src/agents.js`):

```javascript
// src/agents.js — 86 agent'lık manifest (ilk iki kayıt)
function home(...parts) {
  return join(homedir(), ...parts);
}

const AGENTS_DATA = [
  {
    flag: "claude",
    name: "claude-code",
    getDir: () => home(".claude", "skills"),
    label: "~/.claude/skills/",
  },
  {
    flag: "cursor",
    name: "cursor",
    getDir: () => home(".cursor", "skills"),
    label: "~/.cursor/skills/",
  },
  // ... 84 agent daha
];
```

## Agent Tespiti

İlk adım: hangi agent(lar) sistemde kurulu? Kurulu agent'ların skill dizinlerinin var olup olmadığını kontrol ediyoruz:

```javascript
// src/commands/setup.js
import { accessSync, constants } from "node:fs";
import agents from "../agents.js";

const KNOWN_AGENTS = agents.map((a) => ({
  flag: a.flag,
  label: a.name,
  dir: () => a.getDir(),
}));

export function detectAgents() {
  const found = [];
  for (const agent of KNOWN_AGENTS) {
    try {
      accessSync(agent.dir(), constants.F_OK);
      found.push(agent);
    } catch {
      // agent kurulu değil, atla
    }
  }
  return found;
}
```

Bu tespit motoru `rolecraft setup <source>` komutunda da kullanılıyor: tüm tespit edilen agent'lara tek komutla kurulum yapıyor. Aynı mantık `rolecraft doctor`'un sistem sağlık kontrolünde de var:

```shell
$ rolecraft doctor
🔬 rolecraft doctor — System Health Check

   ✅ Node.js version                     v20.15.0
   ✅ Git availability                    detected
   ✅ rolecraft version                   v2.3.0
   ✅ Agent detection                     4/86 supported agents detected
   ✅ Global lockfile schema              v3, valid
   ✅ Global lockfile                     12 skill(s) tracked
   ✅ Skill integrity                     12 checked

```

## Format Dönüşümü

Her yerde SKILL.md olsa da bazı agent'lar eski formatları okumaya devam ediyor. Cursor'ın `.mdc` formatı hâlâ yaygın, bu yüzden iki yönlü bir dönüştürücümüz var:

```javascript
// src/utils/converter.js
export function skillToMdc(content) {
  const { attrs, body } = parseFrontmatter(content);

  const mdc = { alwaysApply: false };
  if (attrs.description || attrs.name) {
    mdc.description = attrs.description || attrs.name;
  }
  if (attrs.mcp_servers) mdc.mcp_servers = attrs.mcp_servers;
  if (attrs.slug) mdc._slug = attrs.slug;

  return serializeFrontmatter(mdc) + body;
}
```

Dönüşüm CLI'dan da kullanılabiliyor (ters yön `.mdc` → SKILL.md de destekleniyor):

```shell
# SKILL.md → .mdc (Cursor formatı)
rolecraft convert ./my-skill/SKILL.md

# .mdc → SKILL.md
rolecraft convert ./my-skill/rule.mdc
```

## Kurulum Akışı: Kaynak → Hedef

`rolecraft install`'ın akışı şöyle:

1. **Kaynağı çözümle** — yerel dizin (`./my-skill`), GitHub referansı (`owner/repo`), git URL'i veya npm paketi (`npm:paket`).
2. **Kapsamı sor** — global (`~/.agents/skills/`), proje (`./.agents/skills/`) veya ikisi birden.
3. **Güvenlik taraması** — tüm dosyalar statik analizden geçer (aşağıda detaylı).
4. **Hedeflere paralel kur** — dosyaları kopyalar (veya `--symlink` ile bağlar).
5. **Lockfile'a yaz** — içerik hash'i ve meta veri kaydedilir.

Kapsam seçimi interaktif:

```shell
$ rolecraft install ./my-skill

Where do you want to install this skill?

  1) Global (~/.agents/skills/)
  2) Project (./.agents/skills/) [default]
  3) Both

Choice [1/2/3] (default: 2): 3
```

Hedef seçimi iki yoldan biri: kapsam (global/proje) ya da agent flag'leri (`--claude --cursor`). Birden fazla agent aynı dizini paylaşıyorsa (örn. `~/.agents/skills/`'i paylaşan 8+ agent) tekilleştirme yapılıyor:

```javascript
// src/api/install.js
function resolveTargets(scope) {
  const targets = [];
  if (scope.global) targets.push("agents");
  if (scope.project) targets.push("project");

  const seenDirs = new Set();
  for (const agent of agents) {
    if (scope[agent.flag]) {
      const dir = agent.getDir();
      if (!seenDirs.has(dir)) {
        seenDirs.add(dir);
        targets.push(agent.flag);
      }
    }
  }
  return targets;
}
```

## Paralel Kurulum

v2.2'de eklenen kurulum motoru (`src/utils/installer.js`) her hedefe ayrı bir işlevle kuruyor ve hepsini paralel çalıştırıyor:

```javascript
// src/utils/installer.js
export async function installSkill(resolved, targets, mode = "copy") {
  async function installToTarget(target) {
    // 1. Hedef dizini çöz (agent veya proje)
    // 2. Eski dosyaları yedekle (~/.agents/.backups/<slug>/)
    // 3. Dosyaları hedef dizine kopyala (veya symlink kur)
    // 4. Lockfile'a contentSha + meta veriyi yaz
  }

  const outcomes = await Promise.allSettled(
    targets.map((target) => installToTarget(target)),
  );

  return outcomes
    .filter((o) => o.status === "fulfilled" && o.value !== null)
    .map((o) => o.value);
}
```

Her kurulum öncesi mevcut dosyalar `~/.agents/.backups/<slug>/` dizinine zaman damgalı JSON olarak yedekleniyor — rollback mekanizmasının temelini bu oluşturuyor.

## Lockfile ve Rollback

Kurulan her skill, içeriğinin SHA-256 hash'iyle lockfile'a yazılıyor:

```javascript
// src/utils/lockfile.js
export function computeContentHash(fileContents) {
  const hash = createHash("sha256");
  for (const name of Object.keys(fileContents).sort()) {
    hash.update(`${name}\0`);
    hash.update(fileContents[name]);
  }
  return hash.digest("hex");
}
```

Global lockfile `~/.agents/.skill-lock.json`, proje lockfile'ı `./.agents/.skill-lock.json`. Bir skill güncellendiğinde eski sürüm lockfile'daki `history` dizisine itiliyor (en fazla 5 sürüm tutulur):

```json
{
  "version": 3,
  "skills": {
    "my-skill": {
      "contentSha": "a1b2c3d4e5f6a1b2c3d4e5f6...",
      "installedAt": "2026-08-10T09:00:00.000Z",
      "agents": ["claude", "cursor"],
      "source": "./my-skill",
      "sourceType": "local",
      "history": [
        {
          "contentSha": "9f8e7d6c5b4a9f8e7d6c5b4a...",
          "installedAt": "2026-07-30T14:22:01.000Z"
        }
      ]
    }
  }
}
```

Rollback, yedekteki dosyaları geri yazıp history'den en yeni kaydı pop'lar:

```shell
# Geçmişi listele
$ rolecraft rollback my-skill --list
📜 Rollback history for "my-skill":
   Current: a1b2c3d4e5f6
   v1: 9f8e7d6c5b4a (2026-07-30T14:22:01.000Z)

# Son sürüme geri al
$ rolecraft rollback my-skill
✅ Rolled back "my-skill" to previous version.
   Files restored: 1
   Targets: claude, cursor
```

`--dry-run` ile önizleme de mümkün.

## Güvenlik Skorlaması

Bir skill'i kaynak koddan kuruyorsanız, ne yüklendiğini bilmek önemli. `src/utils/security.js` her skill'i yüklemeden önce statik analizle tarıyor. Skor weighted bir sisteme dayanıyor:

```javascript
// src/utils/security.js
const WEIGHTS = { critical: 20, high: 10, medium: 3, low: 1 };

const PATTERNS = [
  {
    severity: "critical",
    category: "prompt_injection",
    pattern: /ignore\s+(?:all|previous|above)...instructions/i,
  },
  {
    severity: "critical",
    category: "command_injection",
    pattern: /(?:curl|wget)...\s*[|;]\s*(?:bash|sh|zsh|python)/,
  },
  {
    severity: "high",
    category: "credential_harvesting",
    pattern: /process\.env\.(?:TOKEN|SECRET|API_KEY|...)/i,
  },
  {
    severity: "medium",
    category: "network_request",
    pattern: /(?:https?\.get|https?\.request|fetch\s*\()/,
  },
  // ... 20+ pattern (obfuscated code, file write, sudo, vb.)
];
```

Tarama sonucu `scanSkill()` ile 0–100 arası bir skor üretiyor ve `classifyScore()` üç seviyeye ayırıyor:

| Skor / Durum              | Seviye | Kurulum Davranışı                   |
| ------------------------- | ------ | ----------------------------------- |
| 90–100                    | SAFE   | Onay sormadan kurulur               |
| 70–89                     | REVIEW | Uyarı gösterir, onay ister (`y/N`)  |
| 0–69                      | DANGER | Kurulum engellenir; `--yes` gerekir |
| Herhangi bir kritik bulgu | DANGER | Tek kritik bulgu skoru ezer         |

```javascript
export function classifyScore(score, issues = []) {
  // Herhangi bir critical issue varsa skor ne olursa olsun danger
  if (issues.some((i) => i.severity === "critical")) return "danger";
  if (score >= 90) return "safe";
  if (score >= 70) return "review";
  return "danger";
}
```

Kurulum sırasında gerçek çıktı şöyle:

```shell
$ rolecraft install ./my-skill
✅ Security scan: 100/100 — SAFE
   No issues found
```

Riskli bir skill'de ise:

```shell
⚠️ Security scan: 85/100 — REVIEW
   🟡 [medium] Shell command execution (SKILL.md)
   🟡 [medium] Environment variable access (SKILL.md)

   ⚠️  Recommendation: Review before installing
```

`--yes` flag'i DANGER/REVIEW durumlarını zorlar ama asla sessizce: terminale `⚠️ [DANGER] --yes forcing install...` uyarısı yazılır.

## MCP Sunucu Yönetimi

Model Context Protocol (MCP) sunucularını da RoleCraft ile yönetebiliyorsunuz. MCP komutları kaynak önekiyle çalışıyor:

```shell
# MCP sunucusu kur
rolecraft mcp install npm:@modelcontextprotocol/github --claude --cursor

# Desteklenen kaynak önekleri: npm:, gh:, uvx:, pipx:, go:, deno:, cargo:
rolecraft mcp install uvx:@anthropic/postgres-mcp --cursor

# Kurulu sunucuları listele
rolecraft mcp list

# Kayıtlı sunucuları ara
rolecraft mcp search filesystem --npm

# Yapılandırma doğrulaması
rolecraft mcp check

# Sunucuyu kaldır
rolecraft mcp remove github-mcp-server --cursor
```

Her agent kendi MCP yapılandırma dosyasını kullanıyor — "tek dosya her yere" diye bir şey yok:

| Agent       | Config Dosyası                | Format                    |
| ----------- | ----------------------------- | ------------------------- |
| Claude Code | `~/.claude.json`              | `mcpServers`              |
| Cursor      | `~/.cursor/mcp_config.json`   | `mcpServers`              |
| Windsurf    | `~/.windsurf/mcp_config.json` | `mcpServers`              |
| Continue    | `~/.continue/config.json`     | `experimental.mcpServers` |
| Copilot     | `.github/copilot/.mcp.json`   | `servers`                 |

Altyapı, agent'a göre doğru dosyayı okuyup doğru şemaya yazıyor:

```javascript
// src/utils/mcp.js
export async function addMcpServer(agent, name, serverConfig) {
  const result = await readMcpConfig(agent);
  if (!result) return false;

  const { configPath, data } = result;
  setMcpServerEntry(data, agent, name, serverConfig);

  await mkdir(dirname(configPath), { recursive: true });
  await writeFile(configPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  return true;
}
```

İlginç detay: bir skill, frontmatter'ında `mcp_servers:` bildirirse `rolecraft install` skill ile birlikte MCP sunucularını da kuruyor:

```markdown
---
name: github-skill
slug: my-org/github-skill
mcp_servers:
  - name: github
    source: npm:@modelcontextprotocol/github
---
```

```shell
$ rolecraft install ./github-skill --claude
```

## Init Şablonları

Sıfırdan skill yazmaya başlamak için altı şablon var: `basic`, `code-review`, `git-workflow`, `react`, `security`, `testing`.

```shell
# Şablonları listele
$ rolecraft init --list
Available templates:

  basic           General-purpose skill template for AI agent instructions
  code-review     Code review guidelines and best practices for AI agents
  security        Security guidelines and dangerous pattern detection for AI agents
  ...

# Şablondan skill oluştur
$ rolecraft init my-skill --template code-review
✅ Created skill with "code-review" template at: $PWD/my-skill/SKILL.md
   Slug: my-skill
   Name: my-skill

Next steps:
  1. Edit ./my-skill/SKILL.md with your skill details
  2. rolecraft install ./my-skill
```

## Sonuç

RoleCraft'ın v1'den v2.3'e evrimi, şu temel prensiplerimizi korurken mümkün oldu:

- **Sıfır runtime dependency** — her şey Node.js built-in
- **Evrensel format** — her agent için tek format: SKILL.md
- **Güvenlik önce** — her kurulumda skor hesaplanıyor, şüpheliler engelleniyor
- **Geri alınabilir** — lockfile geçmişi sayesinde rollback her zaman mümkün

Projeyi incelemek isterseniz: [https://github.com/rolecraft-sh/rolecraft](https://github.com/rolecraft-sh/rolecraft)
