---
title: "Modern TypeScript Tips: Cleaner Code"
date: "2026-06-05"
slug: "modern-typescript-ipucu"
description: "Learn how to build modern, reusable, and type-safe utility functions in TypeScript with real-world examples."
tags: ["TypeScript", "JavaScript", "Programming", "Utility Functions", "Clean Code"]
image: "/blog/typescript_tips_cover.webp"
---

Hello,

As projects grow, repeated logic starts to spread across the codebase. Small utility functions solve this problem by making code reusable, predictable, and easier to maintain.

When combined with TypeScript’s powerful type system, utility functions become even more valuable.

In this article, we will explore practical TypeScript utility functions that you can use in real-world applications.

---

## 1. Safe Object Property Access

Accessing nested properties can quickly become messy.

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

TypeScript automatically infers the correct return type.

---

## 2. Debounce Function

Debouncing prevents a function from running too frequently.

Perfect for:

- Search inputs
- Resize events
- Scroll listeners

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

Usage:

```typescript
const onSearch = debounce((value: string) => {
  console.log(value);
}, 300);
```

---

## 3. Deep Clone Utility

Sometimes shallow copy is not enough.

```typescript
function deepClone<T>(value: T): T {
  return structuredClone(value);
}
```

Usage:

```typescript
const settings = {
  theme: {
    dark: true,
  },
};

const copied = deepClone(settings);
```

---

## 4. Remove Undefined Fields

Useful before sending API requests.

```typescript
function removeUndefined<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}
```

Usage:

```typescript
const payload = removeUndefined({
  name: "Samet",
  email: undefined,
});
```

Result:

```typescript
{
  name: "Samet";
}
```

---

## 5. Strongly Typed Group By Function

Grouping data is a common backend and frontend operation.

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

Usage:

```typescript
const users = [
  { name: "John", role: "admin" },
  { name: "Jane", role: "user" },
  { name: "Alex", role: "admin" },
];

const grouped = groupBy(users, (user) => user.role);
```

---

## 6. Async Retry Helper

Network requests can fail temporarily.

Retry utilities improve resilience.

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

Usage:

```typescript
const data = await retry(() =>
  fetch("/api/data").then((r) => r.json())
);
```

---

## 7. Sleep Utility

Simple but extremely useful.

```typescript
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

Usage:

```typescript
await sleep(1000);
```

---

## 8. Exhaustive Type Checking

One of the best TypeScript patterns for maintainability.

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

This pattern ensures every possible case is handled.

---

## 9. Built-in TypeScript Utility Types

TypeScript ships with extremely powerful utility types that help you transform existing types without rewriting them.

These utility types improve maintainability and reduce duplicated type definitions.

---

### Partial<T>

Makes all properties optional.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

type UpdateUserRequest = Partial<User>;
```

Equivalent result:

```typescript
{
  id?: string;
  name?: string;
  email?: string;
}
```

Perfect for update APIs and patch operations.

---

### Required<T>

Makes all properties required.

```typescript
interface DraftUser {
  id?: string;
  name?: string;
}

type FinalUser = Required<DraftUser>;
```

---

### Readonly<T>

Prevents properties from being modified.

```typescript
interface Config {
  apiUrl: string;
}

const config: Readonly<Config> = {
  apiUrl: "https://api.example.com",
};

// Error
config.apiUrl = "new-url";
```

Useful for immutable state management.

---

### Pick<T, K>

Selects only specific properties from a type.

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

Removes properties from a type.

```typescript
interface User {
  id: string;
  password: string;
  email: string;
}

type SafeUser = Omit<User, "password">;
```

Perfect for hiding sensitive data.

---

### Record<K, T>

Creates strongly typed object maps.

```typescript
type Role = "admin" | "user";

const permissions: Record<Role, boolean> = {
  admin: true,
  user: false,
};
```

---

### ReturnType<T>

Extracts the return type of a function.

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

Extracts function parameters as a tuple.

```typescript
function login(username: string, password: string) {}

type LoginParams = Parameters<typeof login>;
```

Result:

```typescript
[string, string]
```

---

### Awaited<T>

Extracts the resolved type of a Promise.

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

Built-in utility types are one of the biggest reasons why TypeScript scales so well in large applications.

Learning them deeply will significantly improve your developer experience.

# Final Thoughts

Utility functions may look small, but they have a massive impact on code quality.

A strong utility layer helps you:

- Reduce duplicated logic
- Improve readability
- Increase type safety
- Build more scalable applications

Modern TypeScript is not only about types — it is about creating a better developer experience.

Start building your own utility collection and evolve it with your projects.