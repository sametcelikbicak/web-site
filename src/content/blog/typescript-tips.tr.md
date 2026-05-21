---
title: "Modern TypeScript İpuçları: Daha Temiz Kod"
date: 
slug: "modern-typescript-ipucu"
description: "Gerçek dünya örnekleriyle modern, yeniden kullanılabilir ve type-safe TypeScript utility fonksiyonlarını öğrenin."
tags: ["TypeScript", "JavaScript", "Yazılım", "Utility Functions", "Clean Code"]
image: "/blog/typescript_tips_cover.webp"
---

# TypeScript Yardımcı Fonksiyonları: Daha Temiz ve Yeniden Kullanılabilir Kod

Projeler büyüdükçe aynı mantığın tekrar tekrar yazıldığı görülür. Küçük yardımcı fonksiyonlar sayesinde kod daha yeniden kullanılabilir, okunabilir ve sürdürülebilir hale gelir.

TypeScript’in güçlü type sistemi ile birleştiğinde utility fonksiyonları çok daha değerli hale gelir.

Bu yazıda gerçek projelerde kullanabileceğiniz pratik TypeScript utility fonksiyonlarını inceleyeceğiz.

---

## 1. Güvenli Object Property Erişimi

Nested object alanlarına erişim zamanla karmaşık hale gelebilir.

```typescript
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: 1,
  name: "Samet",
};

const username = get(user, "name");
```

TypeScript doğru dönüş tipini otomatik olarak çıkarır.

---

## 2. Debounce Fonksiyonu

Debounce, bir fonksiyonun çok sık çalışmasını engeller.

Özellikle şu senaryolarda kullanılır:

- Arama inputları
- Resize eventleri
- Scroll listenerları

```typescript
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
```

Kullanım:

```typescript
const onSearch = debounce((value: string) => {
  console.log(value);
}, 300);
```

---

## 3. Deep Clone Utility

Bazı durumlarda shallow copy yeterli olmaz.

```typescript
function deepClone<T>(value: T): T {
  return structuredClone(value);
}
```

Kullanım:

```typescript
const settings = {
  theme: {
    dark: true,
  },
};

const copied = deepClone(settings);
```

---

## 4. Undefined Alanları Temizleme

API isteği göndermeden önce oldukça faydalıdır.

```typescript
function removeUndefined<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}
```

Kullanım:

```typescript
const payload = removeUndefined({
  name: "Samet",
  email: undefined,
});
```

Sonuç:

```typescript
{
  name: "Samet";
}
```

---

## 5. Strongly Typed Group By Fonksiyonu

Veri gruplama işlemleri hem frontend hem backend tarafında oldukça yaygındır.

```typescript
function groupBy<T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce((acc, item) => {
    const key = getKey(item);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {} as Record<K, T[]>);
}
```

Kullanım:

```typescript
const users = [
  { name: "John", role: "admin" },
  { name: "Jane", role: "user" },
  { name: "Alex", role: "admin" },
];

const grouped = groupBy(users, (user) => user.role);
```

---

## 6. Async Retry Yardımcısı

Network istekleri bazen geçici olarak başarısız olabilir.

Retry utility fonksiyonları uygulamanın dayanıklılığını artırır.

```typescript
async function retry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    return retry(fn, retries - 1);
  }
}
```

Kullanım:

```typescript
const data = await retry(() =>
  fetch("/api/data").then((r) => r.json())
);
```

---

## 7. Sleep Utility

Basit ama çok kullanışlı bir yardımcı fonksiyon.

```typescript
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

Kullanım:

```typescript
await sleep(1000);
```

---

## 8. Exhaustive Type Checking

Sürdürülebilir TypeScript kodu için en güçlü patternlerden biridir.

```typescript
type Status = "loading" | "success" | "error";

function handleStatus(status: Status) {
  switch (status) {
    case "loading":
      return "Loading...";

    case "success":
      return "Success";

    case "error":
      return "Error";

    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}
```

Bu yaklaşım tüm olası durumların handle edildiğinden emin olmanızı sağlar.

---

## 9. Built-in TypeScript Utility Type'ları

TypeScript, mevcut type’ları yeniden yazmadan dönüştürmenizi sağlayan güçlü utility type’larla birlikte gelir.

Bu utility type’lar bakım maliyetini azaltır ve tekrar eden type tanımlarını engeller.

---

### Partial<T>

Tüm alanları optional hale getirir.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

type UpdateUserRequest = Partial<User>;
```

Oluşan sonuç:

```typescript
{
  id?: string;
  name?: string;
  email?: string;
}
```

Özellikle update API’leri için oldukça kullanışlıdır.

---

### Required<T>

Tüm alanları zorunlu hale getirir.

```typescript
interface DraftUser {
  id?: string;
  name?: string;
}

type FinalUser = Required<DraftUser>;
```

---

### Readonly<T>

Property’lerin değiştirilmesini engeller.

```typescript
interface Config {
  apiUrl: string;
}

const config: Readonly<Config> = {
  apiUrl: "https://api.example.com",
};

// Hata
config.apiUrl = "new-url";
```

Immutable state yönetimi için oldukça faydalıdır.

---

### Pick<T, K>

Bir type içerisinden sadece belirli alanları seçer.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

type UserPreview = Pick<User, "id" | "name">;
```

---

### Omit<T, K>

Belirli alanları type içerisinden kaldırır.

```typescript
interface User {
  id: string;
  password: string;
  email: string;
}

type SafeUser = Omit<User, "password">;
```

Sensitive verileri gizlemek için idealdir.

---

### Record<K, T>

Strongly typed object map oluşturur.

```typescript
type Role = "admin" | "user";

const permissions: Record<Role, boolean> = {
  admin: true,
  user: false,
};
```

---

### ReturnType<T>

Bir fonksiyonun dönüş tipini çıkarır.

```typescript
function getUser() {
  return {
    id: 1,
    name: "Samet",
  };
}

type User = ReturnType<typeof getUser>;
```

---

### Parameters<T>

Fonksiyon parametrelerini tuple olarak çıkarır.

```typescript
function login(username: string, password: string) {}

type LoginParams = Parameters<typeof login>;
```

Sonuç:

```typescript
[string, string]
```

---

### Awaited<T>

Promise resolve edildiğinde oluşan tipi çıkarır.

```typescript
async function fetchUser() {
  return {
    id: 1,
    name: "Samet",
  };
}

type User = Awaited<ReturnType<typeof fetchUser>>;
```

---

Built-in utility type’lar TypeScript’in büyük ölçekli uygulamalarda bu kadar güçlü olmasının en önemli nedenlerinden biridir.

Bu yapıları derinlemesine öğrenmek developer experience seviyenizi ciddi şekilde artıracaktır.

# Sonuç

Utility fonksiyonları küçük görünse de kod kalitesi üzerinde büyük etki yaratır.

İyi bir utility katmanı sayesinde:

- Tekrarlanan kod azalır
- Okunabilirlik artar
- Type safety güçlenir
- Daha ölçeklenebilir uygulamalar geliştirilir

Modern TypeScript yalnızca type yazmak değil, aynı zamanda daha iyi bir developer experience oluşturmaktır.

Kendi utility fonksiyon koleksiyonunuzu oluşturmaya başlayın ve projelerinizle birlikte geliştirin.