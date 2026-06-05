---
title: "Angular custom directive"
date: "2021-02-20"
description: "Angular'da custom directive nasıl tanımlanır? Kullanıcı yetki kontrolünü yapan bir directive örneği."
tags: ["Angular", "Directive", "Frontend"]
image: "/blog/angular_custom_directive_cover.webp"
---

Merhaba,

Bu yazımda Angular da custom bir directive nasıl tanımlanır ve kullanılır onu ele alacağım. Bu yazımız için kullanıcımızın yetkisi durumunu kontrol eden bir directive hazırlayıp onun kullanımını inceleyelim. Directive ler basit olarak bir html attribute gibi direk kullanılan ve kullanıldığını html elemanında istenilen şarta göre davranış gösteren bir kontrol mekanizmasıdır.

Bize bu yazımda bir yetki kontrolü için directive oluşturup birkaç farklı kullanıcı için yetkilerine göre directive kullanılan html elemanlarının davranışlarını inceleyelim. Yapacak olduğumuz yetki kontrol directive için bize bir directive tanımı birde yetki kontrolü için kullanacağımız servis tanımı yeterli olacaktır.

İlk olarak directive içinde kullanacak olduğumuz servisimizin tanımını yapalım. Bu tanım için projemiz içinde **services** isimli bir klasör oluşturup içine de **permission.service.ts** isimli dosyamızı ekleyelim. Ekleme işleminden sonra gerekli tanımları yaptığımızda ise dosyamızın içeriği aşağıdaki gibi olacaktır.

```typescript
// permission.service.ts
import { Injectable } from "@angular/core";

@Injectable()
export class PermissionService {
  private validPermissions = ["read", "write", "remove"];

  public setUserPermission(permission: string | string[]): void {
    switch (typeof permission) {
      case "string":
        this.validPermissions = [permission];
        break;
      case "object":
        this.validPermissions = permission.map(p => p);
        break;
    }
  }

  public verify(permission: string): boolean {
    return this.validPermissions.some(
      validPermission => validPermission === permission
    );
  }
}
``` 

Servisimiz hazır olduğuna göre şimdi de directive tanımımızı yapalım ve servisimizi burada kullanalım. Bunun için projemiz içinde **directives** isimli bir klasör oluşturup içine de **check-permission.directive.ts** dosyamızı ekleyelim. Directive dosyamızın içinde ise gerekli olan tanımlamaları aşağıdaki gibi yapalım.

```typescript
// check-permission.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { PermissionService } from "../services/permission.service";

@Directive({
  selector: "[checkPermission]"
})
export class CheckPermissionDirective {
  @Input() public set checkPermission(permissions: string | string[]) {
    this.check(permissions);
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  private check(permissions: string | string[]): void {
    switch (typeof permissions) {
      case "string":
        this.updateView(this.permissionService.verify(permissions));
        break;
      case "object":
        let hasPermission = false;
        permissions.forEach(permission => {
          if (!hasPermission) {
            hasPermission = this.permissionService.verify(permission);
          }
        });
        this.updateView(hasPermission);
        break;
    }
  }

  private updateView(hasPermission: boolean): void {
    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
``` 
Directive tanımı içinde kullandığımız aşağıdaki kod ile html üzerinden directive içine veri gönderimini yapabilir duruma geliyoruz.

>   @Input() public set checkPermission(permissions: string | string[]) {
    this.check(permissions);
  }

Directive kodumuzun içinde görüldüğü gibi servisimizde tanımlı olan **verify** methodu yardımı ile kullanıcımızın yetkisinin olup olmadığına bakıyoruz. Gerekli kontroller sonrasında kullanıcının yetki durumuna göre **updateView** methodu yardımı ile kullanıcının yetkisi olan elemanları görmesi ve yetkisinin olmadığı elemanları görmemesini sağlamış oluyoruz. 

Artık gerekli directive ve servis tanımımız olduğuna göre şimdi de bu tanımları kullanıp sonuçlarını görmek için bir kaç tane kullanıcı tanımını taklit edecek tanımları ve html elemanlarını ekleyelim. Bu tanımlar için projemiz içinde olan **app.component.html** içerisine aşağıdaki gibi bir düzenleme yapalım.

```html
<!-- app.component.html -->
<h1>{{title}}</h1>

<h3>Select User</h3>
<div class="permission-buttons">
	<button (click)="onAdminClick()">Admin User</button>
	<button (click)="onReadClick()">Read User</button>
	<button (click)="onWriteClick()">Write User</button>
	<button (click)="onRemoveClick()">Remove User</button>
  <button (click)="onMultipleClick()">Multiple Permission</button>
</div>


<h3>User Permission Result</h3>
<div *ngIf="showResult">
	<p *checkPermission="'read'">Read permission</p>
	<p *checkPermission="'write'">Write permission</p>
	<p *checkPermission="'remove'">Remove permission</p>
	<p *checkPermission="['buy','sell']">Multiple permission defined for one control(i.e: buy, sell)</p>
</div>
``` 
Yukarıdaki tanımda görüldüğü gibi farklı kullanıcıları temsil eden beş farklı buton ekledik ve bu butonlara tıkladığımız zaman da ilgili kullanıcının yetkisine göre kod içinde tanımlı olan ilgili yetkisinin görünmesi içinde tanımlalarımızı yaptık.

- **Admin User** => Tanımlarımızdaki **read**, **write** ve **remove** yetkilerine sahip ve **User Permission Result** bölümünde **read**, **write** ve **remove** yetkilerini bekleyen alanları görebilecektir.
- **Read User** =>Tanımlarımızdaki **read** yetkisine sahip ve **User Permission Result** bölümünde sadece **read** yetkisini bekleyen alanı görebilecektir.
- **Write User** =>Tanımlarımızdaki **write** yetkisine sahip ve **User Permission Result** bölümünde sadece **write** yetkisini bekleyen alanı görebilecektir.
- **Remove User** =>Tanımlarımızdaki **remove** yetkisine sahip ve **User Permission Result** bölümünde sadece **remove** yetkisini bekleyen alanı görebilecektir.
- **Multiple Permission** =>Tanımlarımızdaki **buy** ve **sell** yetkilerine sahip ve **User Permission Result** bölümünde **buy** ve **sell** yetkisinden herhangi birini bekleyen alanı görebilecektir.

HTML tarafındaki tanımlamalarımızı yaptığımıza göre şimdiden bu tanımların kontrolü yazalım ve kontrollerin yazımı sonrasında da **app.component.ts** içeriğinin aşağıdaki gibi olduğunu görelim.


```typescript
// app.component.ts
import { Component, VERSION } from "@angular/core";
import { PermissionService } from "./services/permission.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public title = `Angular ${VERSION.major} Custom Directive`;
  public showResult: boolean = false;

  constructor(private permissionService: PermissionService) {}

  public onAdminClick(): void {
    this.prepareUserPermission(["read", "write", "remove"]);
  }

  public onReadClick(): void {
    this.prepareUserPermission("read");
  }

  public onWriteClick(): void {
    this.prepareUserPermission("write");
  }

  public onRemoveClick(): void {
    this.prepareUserPermission("remove");
  }

  public onMultipleClick(): void {
    this.prepareUserPermission(["buy", "sell"]);
  }

  private prepareUserPermission(permissions: string | string[]): void {
    this.showResult = false;
    this.permissionService.setUserPermission(permissions);
    setTimeout(() => {
      this.showResult = true;
    }, 100);
  }
}
``` 
Yukarıdaki kod içinde de görülebileceği gibi ilgili butonların click eventlerinde tanımlamış olduğumuz methodlar ile butona tıklandığında o buton için tanımlanan yetki atamalarını yapıp bu atama sonucunda da ekrandaki değişimi görebiliyoruz. Şimdide sırasıyla uygulamanın ilk hali ve ilgili butona tıklandığında oluşan sonuca birlikte bakalım.

Uygulama çalıştığında aşağıdaki gibi sadece butonların aktif olduğu ve permission result bölümün görünmediği bir durum olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1613816034300/KabCoEHf0.png)

Şimdi sırasıyla tek tek butonlara tıklayalım ve sonuçlarını görelim.


> Admin User tıklandığında oluşan sonuç

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1613816111718/0EpRA4J6L.png)

Beklediğimiz gibi tüm tanımlı yetkiler eşleştiği için read, write ve remove yetkilerine sahip alanlar göründü.

> Read User tıklandığında oluşan sonuç

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1613816238234/5ygqrrtPa.png)

Sadece read yetkisine sahip alan göründü. Şimdi de bir sonraki yetkimizi kontrol edelim.

> Write User tıklandığında oluşan sonuç

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1613816346298/QxZSNCLek.png)

Tanımlarımız doğru çalışıyor hangi butona tıklarsak o butona ait yetki tanımı olan alanlar aktif oluyor. Bir sonraki yetkimize bakalım.

> Remove User tıklandığında oluşan sonuç

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1613816424312/UJPyxAX03.png)

Bu buton içinde her şey yolunda ve artık geri sadece bir yetki kontrolü kaldı hemen onu da kontrol edelim.

> Multiple Permission tıklandığında oluşan sonuç

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1613816533254/qx47p_l-8.png)

Tüm yetki butonlarını test ettik ve beklediğimiz gibi sonuçlarını da gördük. Bu tarz bir directive tanımı ile uygulamalarımızda istediğimiz gibi yetki kontrollerini ekleyip sadece yetkisi olan kullanıcıların yetki dahilinde uygulamayı kullanabilmelerini sağlamış oluruz.

Proje ait  **StackBlitz** ve **GitHub** linklerine aşağıdan erişebilirsiniz.

[StackBlitz](https://stackblitz.com/edit/angular-custom-directive-usage?embed=1&file=src/app/app.component.ts)


[GitHub Repo](https://github.com/sametcelikbicak/angular-custom-directive-usage)
