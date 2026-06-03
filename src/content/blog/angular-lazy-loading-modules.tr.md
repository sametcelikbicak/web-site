---
title: "Angular lazy loading modules"
date: "2021-01-15"
description: "Angular içinde lazy loading modules özelliği nasıl kullanılır ve uygulama performansı nasıl artırılır."
tags: ["Angular", "Lazy Loading", "Frontend", "Modules"]
image: "/blog/angular_lazy_loading_cover.webp"
---

Merhaba,

Bu yazımızda Angular içinde lazy loading modules özelliğini inceleyeceğiz. Kısaca lazy loading module bilgisini uygulama çalıştığında değil o module ihtiyaç olduğunda kullanıcı tarayıcısına içeriğin yüklenmesi olarak değerlendirebiliriz.

Öncelikli olarak projemiz içinde **Home**, **About**, **Lazy Module 1** ve **Lazy Module 2** componentlerini oluşturalım. Home ve About componentleri normal tanımlara sahip iken Lazy Module 1 ve Lazy Module 2 kendilerine ait route ve module tanımlarını bulundurmaktadırlar. Bu tanımlar sayesinde ilgili componentlerimizi lazy load tanımı ile kullanabiliyoruz.

Projemiz içinde genel route tanımı yaparken de dikkat etmemiz gereken lazy load module tanımı olacaktır. Normal bir rotue tanımı aşağıdaki gibi yapabiliriz.

```typescript
//app-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { component: AboutComponent, path: "about", pathMatch: "full" },
  { component: HomeComponent, path: "", pathMatch: "full" },
  { path: "**", pathMatch: "full", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
``` 

Bu tanımda sadece Home ve About sayfalarına ait tanımlar mevcut. Şimdi bu tanımlara ilave lazy load modüllerimizi eklemek için aşağıdaki gibi bir tanım yapmamız gerekiyor. Bu tanım ile sisteme kullanıcı lazy1 route una erişmek istediğinde o tanıma sahip modülün yüklenmesi gerektiğini söylemiş oluyoruz.

```typescript
{
    path: "lazy1",
    loadChildren: () =>
      import("./lazy-module-1/lazy1.module").then(m => m.Lazy1Module)
  },
``` 

Bu tanımlama ile projemizde hangi route için lazy module kullanacağız hangisi için normal tanım yapacağımıza karar verdikten sonra oluşan route tanımı aşağıdaki gibi olacaktır. Bizim projemizde **Lazy Module 1** ve **Lazy Module 2** tanımları lazy load olacağı için route tanımımızda bu iki modül için **loadChildren** tanımını eklemiş bulunmaktayız.


```typescript
//app-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { component: AboutComponent, path: "about", pathMatch: "full" },
  {
    path: "lazy1",
    loadChildren: () =>
      import("./lazy-module-1/lazy1.module").then(m => m.Lazy1Module)
  },
  {
    path: "lazy2",
    loadChildren: () =>
      import("./lazy-module-2/lazy2.module").then(m => m.Lazy2Module)
  },
  { component: HomeComponent, path: "", pathMatch: "full" },
  { path: "**", pathMatch: "full", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

``` 

Gerekli route tanımlarından sonra uygulamamız içinde ana sayfada görünmesi ve her bir route tanımını temsil etmesi için aşağıdaki gibi bir sayfa oluşturalım.

```html
<!-- app.component.html -->
<h1>
	{{ title }}
</h1>

<button routerLink="">Home</button>
<button routerLink="about">About</button>
<button routerLink="lazy1">Lazy Module 1</button>
<button routerLink="lazy2">Lazy Module 2</button>

<app-home></app-home>
``` 

Bu tanım ile birlikte artık uygulamamızı çalıştırdığımızda Home ve About butonları bize direk kendi sayfalarını göstereceği gibi Lazy Module 1 ve Lazy Module 2 butonlarını tıkladığımızda ise ilk olarak bu componentlere ait dosyalar sisteme indirildikten sonra sayfalar bize gösterilecektir.

Lazy load modül olarak tanımlanan componentlerin ve normal componentlerin çalışma zamanındaki davranışlarını görmek için aşağıdaki videoyu izleyebilirsiniz. 

Örnek kullanıma ait projeyi aşağıdaki **stackblitz** linki üzerinden erişebiliriniz.

**Video**

https://youtu.be/j1eQXqPbTj8

**Proje**

[StackBlitz](https://stackblitz.com/edit/angular-modules-lazy-loading?devtoolsheight=33&embed=1&file=src/app/app-routing.module.ts)
