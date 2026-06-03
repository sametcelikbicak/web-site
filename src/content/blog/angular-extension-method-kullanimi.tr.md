---
title: "Angular Extension Method Kullanımı"
date: "2021-01-02"
description: "Angular projelerinde string, number, date ve boolean tipleri için extension method nasıl oluşturulur ve kullanılır, pratik örneklerle anlatıyorum."
tags: ["Angular", "TypeScript", "Extension Method", "Frontend"]
image: "/blog/angular_extension_method_cover.webp"
---

Merhaba,

Uzun bir zaman sonra yeniden blog yazmaya başladım ve bunu yeni keşfettiğim [hashnode](https://hashnode.com/) platformu üzerinden yapıyorum. Bu yazımda bir Angular projesi içinde extension method kullanımına bakacağız. Örnek olarak **string**, **number**, **date** ve **boolean** tipleri için extension hazırlayıp kullanımını ele alacağız.

Öncelikle projemiz içinde bir **extensions** klasörü oluşturalım ve ilgili tipler için hazırlayacağımız methodları buraya ekleyelim.

İlk olarak **string** tipi için **toCamelCase()**, **toPascalCase()** ve **toCapitalizeFirstLetter()** methodlarını hazırlayalım. Aşağıda tanımları bulabilirsiniz.

```typescript
//string.extensions.ts
declare global {
  interface String {
    toCamelCase(): string;
    toPascalCase(): string;
    toCapitalizeFirstLetter(): string;
  }
}

String.prototype.toCamelCase = function(): string {
  return this.replace(/(?:^\w|[A-Z]|-|\b\w)/g, (character, index) =>
    index === 0 ? character.toLocaleLowerCase() : character.toLocaleUpperCase()
  );
};

String.prototype.toPascalCase = function(): string {
  return this.replace(/(?:^\w|[A-Z]|-|\b\w)/g, firstCharacter =>
    firstCharacter.toLocaleUpperCase()
  );
};

String.prototype.toCapitalizeFirstLetter = function(): string {
  return this.charAt(0).toLocaleUpperCase() + this.slice(1);
};

export {};
```

Şimdi de **number** tipi için **isNAN()** methodunu yazalım. Aşağıda tanımı bulabilirsiniz.

```typescript
//number.extensions.ts
declare global {
  interface Number {
    isNAN(): boolean;
  }
}

Number.prototype.isNAN = function(): boolean {
  return isNaN(this);
};

export {};
```

Şuan string ve number tipleri için methodlarımız hazır. Şimdi sırada **date** tipi için yazacağımız **toStringFormat()** methodu var. Tanımı aşağıdaki gibidir.

```typescript
//date.extensions.ts
declare global {
  interface Date {
    toStringFormat(): string;
  }
}

Date.prototype.toStringFormat = function(): string {
  return this.toISOString().substring(0, 10);
};

export {};
```

Son olarak **boolean** tipi içinde **not()** methodunu ekleyelim. Dosyamız aşağıdaki gibi olacaktır.

```typescript
//boolean.extensions.ts
declare global {
  interface Boolean {
    not(): boolean;
  }
}

Boolean.prototype.not = function(): boolean {
  return !this;
};

export {};
```

Artık tüm tipler için methodlarımız hazır olduğunda göre şimdi onları kullanma zamanı. Tek tek extension dosyalarını kullanmak yerine onları extension klasörü altında tanımlı bir **index.ts** dosyası içine alalım ve o şekilde proje genelinde erişim için **main.ts** içinde import edelim.

```typescript
//index.ts
import "./boolean.extensions";
import "./date.extensions";
import "./number.extensions";
import "./string.extensions";
```

Bu index.ts dosyamız sayesinde tüm extension tanımlarımızı main.ts dosyasında import ettikten sonra artık kullanımına geçebiliriz. Proje içinde ister **html** ister **ts** tarafında extension methodlarımızı kullanabiliriz. Örnek kullanıma ait projeyi aşağıdaki **stackblitz** linki üzerinden erişebilirsiniz.

Tabiki bu tarz bir extension yazımına ihtiyaç duymamız durumunda bazı durumları da göz önüne almamız gerekmekte. Örneğin JavaScript içinde yazdığımız extension method isminde bir method gelebilir veya bir kütüphane içinde bu tarz bir extension yazıyorsak başkasının yazdığını methodları ezebiliriz.

**Proje**

- [StackBlitz Demo](https://stackblitz.com/edit/angular-extensions?devtoolsheight=33&embed=1&file=src/app/app.component.ts)
