---
title: "Angular extension method içinde servis kullanımı"
date: "2021-01-18"
description: "Angular extension methodlarında servisleri (service locator pattern ile) nasıl kullanabileceğinizi öğrenin."
tags: ["Angular", "TypeScript", "Service", "Extension Method", "Frontend"]
image: "/blog/angular_extension_method_service_cover.webp"
---

## Angular extension method içinde servis kullanımı

Merhaba,

Bu yazımda bir Angular extension methodu içinde servis kullanımını ele alacağız. Öncelikle Angular da servisleri componentlere ya da başka servislerin içine inject ederek kullanabiliyoruz fakat bir extension method için bu yöntem geçerli olmadığı için kendimiz bir injector yapısı kurup bu yeni yapı ile extension method içinde servisimizi kullanacağız.

Öncelikle injector için bir class oluşturalım. 

```typescript
//service-locator.ts
import { Injector } from "@angular/core";

export class ServiceLocator {
    public static injector: Injector;
}
``` 

Şimdi bu yeni oluşturduğumuz class ile kendi injector yapımızı oluşturmaya devam edelim. Bir sonraki adım olarak bu class **AppModule** altında kullanılarak class içinde tanımladığımız injector değişkenine atama yapıyoruz. Bu değişken ile projenin herhangi bir yerinde istediğimiz servisi çağırıp kullanabiliriz ve bunu yapmak için bir servis ya da component constructor methodunda inject yapmamıza gerek kalmıyor.

```typescript
//app.module.ts
import { Injector } from "@angular/core";

export class AppModule {
    constructor(private injector: Injector) {
        ServiceLocator.injector = this.injector;
    }
}
``` 

Artık kendi injector classımız ve injector yapımız hazır. Şimdi bu yapının kullanımına göz atalım. Bu yapıyı kullanmak için bir servis ve birde extension methodu hazırlayalım. İlk olarak bize sabit bir veri dönen servisimizi yazalım. Bu servisi sadece injector yapımızın testi için kullanılacağından çok bir özelliği olmasına gerek yok, sadece bir method ile sabit bir değer dönmesi yeterli olacaktır.

```typescript
//custom.service.ts
import { Injectable } from "@angular/core";

@Injectable()
export class CustomService {
  constructor() {}

  public getTestValue(): string {
    return "Bu veri servisten geliyor";
  }
}
``` 

Bize sabit veri dönen servisimiz ve methodumuz hazır. Normal şartlarda bu servisi kullanmak için ya bir başka servisin ya da bir componentin constructor methodunda inject etmemiz gerekiyordu. Şimdi ise bu servisi artık constructor dan inject etmeden yeni eklediğimiz injector yapımız ile erişip kullanacağız. Sırada bu servisin kullanılacak olduğu bir extension methoduna ihtiyacımız var ve hemen onuda ekleyelim.

```typescript
//string.extensions.ts
import { CustomService } from "./custom.service";
import { ServiceLocator } from "./service-locator";

declare global {
  interface String {
    messageFromService(): string;
  }
}

String.prototype.messageFromService = function(): string {
  const customService: CustomService = ServiceLocator.injector.get(
    CustomService
  );

  return customService.getTestValue();
};

export {};
``` 

Extension methodumuzu ekledik ve içinde daha önce hazırladığımız custom servisimizi kullanımı yaptık. Kod içinde de görüleceği gibi;

> 
CustomService = ServiceLocator.injector.get(
    CustomService
  );

satırı ile sistemimizde olan servisimizi constructor dan inject etmeden direk kendi hazırladığımız injection yapısı ile erişip kullanmış olduk. Şimdi de bir html içinde bu methodumuzun kullanımını yapalım.


```html
<!-- app.component.html -->
<h1>
	{{ title }}
</h1>

<h3>
	Extension method sonucu: {{ title.messageFromService() }}
</h3>
``` 
Ayrıca sadece extension method içinde değil bir class içinden de bu yöntem ile injector yapısını kullanıp isteğimiz servise erişebiliriz. Bu yöntemide denemek için **Test** adında bir class oluşturup içine de bir static method ekleyip injector yapımızı kullanalım.


```typescript
//test.ts
import { CustomService } from "./custom.service";
import { ServiceLocator } from "./service-locator";

export class Test {
  public static serviceMessage(): string {
    const customService: CustomService = ServiceLocator.injector.get(
      CustomService
    );

    return customService.getTestValue();
  }
}
``` 

Şimdide bu test classımızı app.component içinde kullanalım ve html içinde sonucunu gösterelim.

```typescript
//app.component.ts
import { Component, VERSION } from "@angular/core";
import "./string.extensions";
import { Test } from "./test";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = `Angular ${VERSION.major} service using in extension method `;
  serviceMessage = "";

  constructor() {
    this.serviceMessage = Test.serviceMessage();
  }
}
``` 
Html içeriğide aşağıdaki gibi olacaktır.

```html
<!-- app.component.html -->
<h1>
	{{ title }}
</h1>

<h3>
	Extension method sonucu: {{ title.messageFromService() }}
</h3>

<h4>Class içinde kullanım sonucu: {{ serviceMessage }}</h4>
``` 

Kısaca projelerimiz içinde bir şekilde constructor olmadan bir servise erişmemiz gerekirse bu kendi oluşturduğumuz injector yapısı ile istediğimiz zaman istediğimiz yerden servislerimizi kullanabiliriz.

Örnek kullanıma ait projeyi aşağıdaki **stackblitz** linki üzerinden erişebiliriniz.


**Proje**

[StackBlitz](https://stackblitz.com/edit/angular-extensions-services?embed=1&file=src/app/app.component.html)
