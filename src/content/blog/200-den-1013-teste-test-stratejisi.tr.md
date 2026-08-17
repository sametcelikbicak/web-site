---
title: "200'den 1013 Teste: RoleCraft'ta Test Stratejisi"
date: "2026-08-06"
slug: "200den-1013-teste-test-stratejisi"
description: "RoleCraft'ı ~200 testten 1013'e nasıl çıkardım? node:test ile test yazmanın incelikleri, dış bağımlılık izolasyonu ve CI entegrasyonu."
tags: ["Node.js", "Test", "node:test", "CI/CD", "Yazılım Kalitesi"]
image: "/blog/200_den_1013_teste_test_stratejisi_cover.webp"
---

Merhaba,

Bir önceki yazım olan [Sıfır Bağımlılıkla CLI Nasıl Yazılır? RoleCraft'ın Mimarisi](https://sametcelikbicak.com/blog/sifir-bagimlilikla-cli-nasil-yazilir) içeriğinden sonra RoleCraft v1'de yaklaşık 200 test vardı. v2.3'e geldiğimizde bu rakam **1013'e** çıktı. Bu yazıda bu süreci, hangi stratejileri uyguladığımı ve `node:test` modülünün pratikte nasıl göründüğünü anlatacağım.

## Neden 1013 Test?

Test sayısı tek başına bir metrik değil ama arkasındaki hikaye önemli: RoleCraft 86+ farklı AI agent'ı destekliyor. Her agent farklı bir konfigürasyon formatı kullanıyor. Bir agent için yazılan skill kurulum kodu başka bir agent'ı bozabilir.

Bu yüzden **regresyon güvencesi** kritik. 1013 test, "bir şeyi değiştirdiğimde neyi kırdım?" sorusuna anında yanıt verebilmemi sağlıyor.

## node:test Modülü

Jest ya da Mocha yerine neden `node:test`? Çünkü sıfır dependency politikamız test için de geçerli.

```javascript
import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
```

### Temel Test Yapısı

Testler modüllerin yanında, aynı dizinde duruyor. Örnek olarak install API'sinin testi:

```javascript
// src/api/install.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { apiInstallSkills } from "./install.js";

describe("apiInstallSkills", () => {
  it("geçerli bir SKILL.md kaynağını işler", async () => {
    const result = await apiInstallSkills("https://example.com/SKILL.md");
    assert.equal(result.success, true);
  });

  it("hatalı kaynakta kullanıcı dostu hata fırlatır", async () => {
    await assert.rejects(() => apiInstallSkills("not-a-url"), {
      name: "UserError",
    });
  });
});
```

### Lifecycle Hook'ları

Her test grubunda ortak kurulum/temizlik işlemleri için:

```javascript
import { describe, it, before, after, beforeEach } from "node:test";
import { mkdtempSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("dosya sistemi testleri", () => {
  let tempDir;

  before(() => {
    // Tüm testlerden önce bir kez çalışır
    tempDir = mkdtempSync(join(tmpdir(), "rolecraft-test-"));
  });

  after(async () => {
    // Tüm testlerden sonra temizlik
    await rm(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    // Her testten önce çalışır
    // state sıfırla vs.
  });

  it("skill dosyası oluşturulur", async () => {
    // tempDir kullanılabilir
    assert.ok(tempDir);
  });
});
```

## Test Organizasyonu

1013 testi yönetilebilir kılmak için en önemli karar: **ayrı bir `tests/` klasörü yok.** Her dosyanın test dosyası onun yanında, aynı dizinde duruyor. Bir modülü açtığında testini de hemen görüyorsun.

```
src/
  api/
    install.js
    install.test.js      # install API testleri
    rollback.js
    rollback.test.js     # rollback API testleri
    check.js
    check.test.js        # check API testleri
    registry.js
    registry.test.js     # registry testleri
    list.js
    list.test.js         # list API testleri
    diff.js
    diff.test.js         # diff API testleri
    test.js
    test.test.js         # test API testleri
    ...                  # compose, mcp, profile, setup, update, use, verify, watch ...
  commands/
    install.js
    install.test.js      # install komutu testleri
    doctor.js
    doctor.test.js       # doctor komutu testleri
    mcp.js
    mcp.test.js          # mcp komutu testleri
    rollback.js
    rollback.test.js     # rollback komutu testleri
    check.js
    check.test.js        # check komutu testleri
    update.js
    update.test.js       # update komutu testleri
    ...                  # agents, bundle, ci, compose, convert, diff, init, list, profile, publish, remove, setup, test, upgrade, use, verify, watch ...
  utils/
    errors.js
    errors.test.js       # UserError ve hata yardımcıları
    installer.js
    installer.test.js    # kurulum yardımcıları
    security.js
    security.test.js     # güvenlik skoru
    resolver.js
    resolver.test.js     # kaynak çözümleme
    lockfile.js
    lockfile.test.js     # lockfile yönetimi
    mcp.js
    mcp.test.js          # MCP yardımcıları
    profile.js
    profile.test.js      # profil yönetimi
    spinner.js
    spinner.test.js      # progress bar testleri
    templates/
      index.js
      index.test.js      # template sistemi
  agents/
    manifest.js
    manifest.test.js     # agent manifest testleri
  index.js
  index.test.js          # public API testleri
```

Bu yapının faydası: bir dosyayı değiştirdiğinde hangi testlerin etkileneceği anında görünüyor. `install.js`'e dokunuyorsan `install.test.js`'e bakman yeterli.

## Test Çalıştırma

```shell
# Tüm testleri çalıştır
node --test --test-concurrency=1

# Belirli bir dosyayı test et
node --test src/commands/install.test.js

# Coverage ile
node --test --experimental-test-coverage
```

`--test-concurrency=1` neden? Dosya sistemi testleri paralel çalışınca çakışabiliyor. Agent konfigürasyon dosyaları gerçek dizinlere yazıldığında testler birbirini bozuyor. Güvenli yol: seri çalıştırma.

## Dış Bağımlılıkları İzole Etme

`node:test`'in yerleşik `mock` modülü var ama biz production'da daha şeffaf bir yol seçtik: **dependency injection ve ortam izolasyonu.** Bu sayede testler gerçek kodu test ediyor ve her test grubu izole bir ortamda çalışıyor.

### HOME Dizini ve Geçici Dizin İzolasyonu

RoleCraft kullanıcı ayarlarını `$HOME` altında tutuyor. Her test grubu kendi sanal `$HOME`'unu kuruyor:

```javascript
// src/api/install.test.js
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("install API", () => {
  let tempDir, origHome, origCwd;

  before(() => {
    tempDir = mkdtempSync(join(tmpdir(), "rolecraft-test-"));
    origHome = process.env.HOME;
    origCwd = process.cwd();
    process.env.HOME = tempDir; // rolecraft bu dizini kullanır
    process.chdir(tempDir);
  });

  after(async () => {
    process.chdir(origCwd);
    process.env.HOME = origHome;
    await rm(tempDir, { recursive: true, force: true });
  });

  it("skill dosyası oluşturulur", async () => {
    // tempDir altında gerçek dosya sistemi işlemleri
    assert.ok(tempDir);
  });
});
```

### Dependency Injection

İnteraktif komutlar prompt fonksiyonunu dışarıdan alıyor. Testlerde kullanıcı girdisini sabitleyebiliyoruz:

```javascript
import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import {
  installCommand,
  setAskQuestion,
  resetAskQuestion,
} from "../src/commands/install.js";

describe("interaktif kurulum", () => {
  beforeEach(() => {
    // Kullanıcıdan ne sorarsa sorsun 'cursor' yanıtını ver
    setAskQuestion(async () => "cursor");
  });

  after(() => resetAskQuestion());

  it("agent seçimini sorar", async () => {
    const result = await installCommand("https://example.com/SKILL.md");
    assert.ok(result);
  });
});
```

### Console Stubbing

Kullanıcıya gösterilen hata çıktısını test etmek için `console.error`'ı yakalıyoruz:

```javascript
// src/utils/errors.test.js
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { UserError, showError } from "./errors.js";

describe("showError", () => {
  let output = [];
  let origConsole;

  before(() => {
    origConsole = console.error;
    console.error = (...args) => output.push(args.join(" "));
  });

  after(() => {
    console.error = origConsole;
  });

  it("UserError mesajını yazar", () => {
    showError(
      new UserError("Kaynak bulunamadı", { suggestion: "URL'yi kontrol et" }),
    );
    assert.match(output.join(" "), /Kaynak bulunamadı/);
  });
});
```

## Kullanıcı Hata Sistemi (UserError)

1013 teste ulaşmadaki en büyük katkı, `UserError` sistemini eklemek oldu. Her hata durumu için hem "hata doğru fırlatılıyor mu" hem de "mesaj kullanıcı dostu mu" testi yazıldı:

```javascript
// src/utils/errors.js
export class UserError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.name = "UserError";
    this.suggestion = opts.suggestion || ""; // Kullanıcıya ne yapması gerektiğini söyle
    this.detail = opts.detail || ""; // Teknik detay (--verbose ile gösterilir)
    this.userCode = opts.code || ""; // Makine tarafından okunabilir kod
  }
}
```

```javascript
// src/utils/errors.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { UserError } from "./errors.js";

describe("UserError", () => {
  it("mesaj ve suggestion doğru atanır", () => {
    const err = new UserError("Kaynak bulunamadı", {
      suggestion: "URL'nin doğru olduğundan emin olun: rolecraft install <url>",
    });

    assert.equal(err.message, "Kaynak bulunamadı");
    assert.ok(err.suggestion.includes("rolecraft install"));
    assert.equal(err.name, "UserError");
  });

  it("Error sınıfından türüyor", () => {
    const err = new UserError("test");
    assert.ok(err instanceof Error);
  });
});
```

## 200'den 1013'e: Ne Değişti?

| Dönem | Test Sayısı | Eklenenlerin Nedeni                                                             |
| ----- | ----------- | ------------------------------------------------------------------------------- |
| v1    | ~200        | Temel komut testleri                                                            |
| v2.0  | ~900        | MCP yönetimi, 86+ agent desteği, security scoring                               |
| v2.1  | 919         | Agents manifest komutu, Node.js API modülleri, benchmark                        |
| v2.2  | 989         | Rollback mekanizması, UserError sistemi, init template sistemi, paralel kurulum |
| v2.3  | 1013        | Spinner/progress bar testleri, watch debounce, güvenlik sertleştirme            |

Her yeni feature için şu soruyu soruyorum: **"Bu feature kaç farklı şekilde kırılabilir?"** Her kırılma senaryosu bir test oluyor.

## CI'da Testler

GitHub Actions'ta testler her PR'da otomatik çalışıyor:

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: "24"
      - run: npm ci
      - run: npm run lint
      - run: node --test --test-concurrency=1
```

## Sonuç

`node:test` başlangıçta minimal görünüyor ama production kullanımı için fazlasıyla yeterli. Hiç dependency eklemeden 1013 test yazmak mümkün.

İyi test stratejisi için önerilerim:

1. **Her feature ile birlikte test yaz** — sonraya bırakma
2. **Hata senaryolarını atlatma** — mutlu yol testleri yetmez
3. **Her agent için ayrı test** — regresyonu erkenden yakala
4. **CI'da çalıştır** — lokalden farklı davranabilir

RoleCraft kaynak kodu: [https://github.com/rolecraft-sh/rolecraft](https://github.com/rolecraft-sh/rolecraft)
