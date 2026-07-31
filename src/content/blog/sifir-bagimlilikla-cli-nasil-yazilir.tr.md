---
title: "Sıfır Bağımlılıkla CLI Nasıl Yazılır? RoleCraft'ın Mimarisi"
date: "2026-07-31"
slug: "sifir-bagimlilikla-cli-nasil-yazilir"
description: "Hiç runtime dependency kullanmadan, sadece Node.js built-in modülleriyle production-ready bir CLI nasıl yazılır? RoleCraft'ı inşa ederken öğrendiklerim."
tags: ["Node.js", "CLI", "JavaScript", "Açık Kaynak", "Yazılım Mimarisi"]
image: "/blog/sifir_bagimlilikla_cli_cover.webp"
---

Merhaba,

`npm install` yaptıktan sonra `node_modules` klasörünün nasıl şiştiğini hepimiz gördük. RoleCraft'ı geliştirirken kendime bir kural koydum: **sıfır runtime dependency.** Bu yazıda bu kararın arkasındaki gerekçeleri ve bizi nasıl etkilediğini anlatacağım.

## Neden Dependency Kullanmamak?

Bir CLI aracı için üçüncü parti paket kullanmak çoğunlukla şu sorunları doğuruyor:

- **Supply chain riski:** `left-pad` olayını hatırlayın. Bağımlı olduğunuz paketin yazarı onu unpublish ederse projeniz kırılır.
- **Güvenlik açıkları:** Her yeni dependency, saldırı yüzeyini genişletir. `npm audit` uyarıları hiç bitmez.
- **Kurulum hızı:** `npx rolecraft` ilk çalıştırmada hiç paket indirmek zorunda değil.
- **Öngörülebilirlik:** Bugün çalışan şey 6 ay sonra da aynı şekilde çalışır.

## Node.js Built-in Modülleri Yeterli mi?

Evet. Node.js ≥20 ile birlikte ihtiyacımız olan her şey geliyor:

| İhtiyaç              | Kullandığımız Modül                    |
| -------------------- | -------------------------------------- |
| Dosya okuma/yazma    | `node:fs/promises`                     |
| Dizin işlemleri      | `node:path`                            |
| HTTP istekleri       | `node:https`                           |
| Alt süreç çalıştırma | `node:child_process`                   |
| Test yazma           | `node:test` + `node:assert`            |
| Renk/stil            | ANSI escape kodları (sıfır dependency) |

## Pratikte Nasıl Görünüyor?

### HTTP İsteği — `node-fetch` Olmadan

Pek çok CLI, HTTP istekleri için `axios` ya da `node-fetch` kullanır. RoleCraft'ta bunu tamamen built-in `node:https` ile çözdük:

```javascript
// src/utils/http.js
import { get } from "node:https";

export function fetchJson(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`JSON parse hatası: ${url}`));
        }
      });
    }).on("error", reject);
  });
}
```

### Terminal Renkleri — `chalk` Olmadan

`chalk` paketi çok kullanışlı ama biz için gereksiz bir dependency. ANSI kodlarıyla aynı sonucu alıyoruz:

```javascript
// src/utils/color.js
export const color = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
};
```

Kullanımı:

```javascript
import { color } from "./utils/color.js";

console.log(color.green("✓") + " Skill başarıyla kuruldu");
console.log(color.red("✗") + " Bağlantı hatası");
```

### Argüman Ayrıştırma — `commander` Olmadan

`commander.js` veya `yargs` yerine kendi basit argüman parçalayıcımızı yazdık:

```javascript
// src/cli/args.js
export function parseArgs(argv) {
  const args = argv.slice(2); // node ve script adını çıkar
  const flags = {};
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith("-")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}
```

## Dosya Sistemi — Async/Await ile

`node:fs/promises` modülü, callback cehennemine girmeden temiz async kod yazmamızı sağlıyor:

```javascript
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

// Skill dosyasını oku
async function readSkill(skillPath) {
  try {
    const content = await readFile(skillPath, "utf-8");
    return content;
  } catch (err) {
    if (err.code === "ENOENT") {
      return null; // Dosya yok, sorun değil
    }
    throw err;
  }
}

// Skill'i hedefe kopyala
async function installSkill(source, targetDir) {
  await mkdir(targetDir, { recursive: true });
  const content = await readSkill(source);
  await writeFile(join(targetDir, "SKILL.md"), content, "utf-8");
}
```

## Modül Sistemi: ES Modules

`require()` değil, `import/export` kullanıyoruz. Bunu sağlamak için `package.json`'a tek bir satır eklemek yeterli:

```json
{
  "type": "module"
}
```

Bu sayede:

```javascript
// ✅ Beklenen kullanım
import { join } from "node:path";

// ❌ İstenmeyen kullanım
const path = require("path");
```

## Test Yazmak — `jest` veya `mocha` Olmadan

Node.js 20 ile gelen `node:test` modülü test yazmak için oldukça yeterli:

```javascript
import { test, describe } from "node:test";
import assert from "node:assert";
import { parseArgs } from "../src/cli/args.js";

describe("parseArgs", () => {
  test("flag ve positional argümanları doğru ayrıştırır", () => {
    const result = parseArgs(["node", "script", "install", "--dry-run"]);
    assert.deepEqual(result.positional, ["install"]);
    assert.equal(result.flags["dry-run"], true);
  });

  test("değerli flag ayrıştırır", () => {
    const result = parseArgs([
      "node",
      "script",
      "install",
      "--agent",
      "claude-code",
    ]);
    assert.equal(result.flags.agent, "claude-code");
  });
});
```

Çalıştırmak için:

```shell
node --test
```

## Sonuç

Sıfır dependency politikası başta kısıtlayıcı görünse de uzun vadede şu avantajları sağladı:

- `npm audit` çalıştırdığımızda **0 vulnerability** çıkıyor
- `npx rolecraft` ilk çalıştırmada hiç bekleme yok
- Kodu başka birine anlatmak çok daha kolay — her şey standart Node.js

Eğer siz de bir CLI aracı yazıyorsanız, önce Node.js built-in'lerinin ne kadar güçlü olduğuna bir bakın. Çoğu zaman ihtiyacınız olan her şey zaten orada.

Rolecraft'ın kaynak kodunu incelemek isterseniz: [https://github.com/rolecraft-sh/rolecraft](https://github.com/rolecraft-sh/rolecraft)
