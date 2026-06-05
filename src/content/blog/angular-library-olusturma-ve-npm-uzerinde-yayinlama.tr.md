---
title: "Angular library oluşturma ve Npm üzerinde yayınlama"
date: "2021-09-25"
description: "Angular ile custom library (kütüphane) nasıl oluşturulur ve oluşturulan library npm üzerinde nasıl yayınlanır adım adım anlatımı."
tags: ["Angular", "npm", "Library", "Frontend"]
image: "/blog/angular_npm_library_cover.webp"
---

Merhaba,

Bu yazımda Angular ile bir **library (kütüphane)** oluşturup ve daha sonra oluşturduğumuz library paketini NPM üzerinde yayınlamaktan bahsedeceğim.


Öncelikle bir çalışma alanı oluşturalım ve daha sonra buraya gerekli olan library tanımlarımızı ekleyelim. Aşağıdaki komut ile bir **workspace (çalışma alanı)** oluşturalım.
```shell
ng new library-workspace --create-application=false
``` 
Bu kod çalışmasında sonra oluşan projenin dizinine konumlanalım.
```shell
cd library-workspace
``` 
İlgili dizine geçtikten sonra da projemizi açmak için aşağıdaki komutu kullanabiliriz. Ben bu işlemler için Visual Studio Code kullandım sizde başka bir editör kullanabilirsiniz.
```shell
code .
```
Projemizi açtığımızda örnek uygulamanın olmadığı sadece bizim için gerekli olan dosyaların bulunduğunu görebiliriz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1621079192766/WsXlIWz3P.png)

Artık ortam hazır olduğuna göre şimdi library oluşturma işlemine geçebiliriz. Library oluştururken **--prefix** paremetresi ile projemizde custom prefix tanımı olarak **ngx** değerini vermiş olacağız, eğer bu parametreyi kullanmazsak varsayılan değer olan **lib** prefix bilgisi tanımlanmış olacaktır.

```shell
ng generate library auto-focus --prefix ngx
``` 
Komutu çalıştırdıktan sonra projemizde artık library için gerekli eklemeler yapılmış durumdadır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632495989179/P_M6WiBqS.png)

Artık ihtiyacımız olan kütüphane öğelerini oluşturmak için aşağıdaki konuma gidelim ve bizim örneğimiz için bir adet **directive** oluşturalım.

```shell
cd projects/auto-focus/src/lib/
``` 
Directive oluşturmadan sonra projemizin yapısı aşağıdaki gibi olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632496055614/064_tx1zC.png)

Projemizdeki dosya yapımızı gördükten sonra şimdi directive kodlarımıza bakalım.

```typescript
// auto-focus.directive.ts

import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[ngxAutoFocus]' })
export class AutoFocusDirective implements OnInit {
  private autofocus: boolean = false;

  @Input() public set ngxAutoFocus(condition: boolean) {
    this.autofocus = condition !== false;
  }

  constructor(private el: ElementRef) {}

  public ngOnInit(): void {
    if (this.autofocus) {
      this.el.nativeElement.focus();
    }
  }
}
``` 
Directive tanımını yapmış olduk, şimdi bu tanımı kullanabilmek için librarydeki **auto-focus.module** içinde export etmemiz gerekiyor. Gerekli tanımı yaptıktan sonra module içeriğimiz aşağıdaki gibi olacaktır.

```typescript
// auto-focus.module.ts

import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';

@NgModule({
  declarations: [AutoFocusDirective],
  imports: [],
  exports: [AutoFocusDirective],
})
export class AutoFocusModule {}
``` 
İhtiyacımız olan tanımlamaları yaptığımıza göre şimdi bu directive ve module tanımlarını **public_api** içerisinde export edip paketi yayınladığımızda kullanıma hazır hale gelsinler. Eğer library içinde yaptığımız **component**, **pipe**, **directive** vb. araçları **public_api** içerisinde export etmezsek paketi yayınladığımızda kullanılabilir durumda olmazlar. Bu paket için gerekli olan export işlemini yaptıktan sonra public_api içeriğimiz aşağıdaki gibi olacaktır.

```typescript
// public-api.ts
/*
 * Public API Surface of auto-focus
 */

export * from './lib/auto-focus.directive';
export * from './lib/auto-focus.module';
``` 

Şu ana kadar herşeyimizi tanımladık ve paketimizi yayınlamaya hazır hale getirdik, şimdi yapmamız gerekenler ise paketi yayınladığmızda kullanıcıların görecek olduğu bilgileri düzenlemek, paketimizin versiyon bilgisini ayarlamak. Bu işlem için projemizde **library-workspace/projects/auto-focus** altında bulunan **package.json** ve **README.md** dosyalarını güncelleyeceğiz.
İlk olarak package.json dosyamızı güncelleylim ve güncelleme sonrasında içeriğimizin aşağıdaki gibi olduğunu görebiliriz.

```json
{
  "name": "@sametcelikbicak/auto-focus",
  "version": "0.0.5",
  "description": "Auto focus directive for Angular projects",
  "peerDependencies": {
    "@angular/common": "^11.2.14",
    "@angular/core": "^11.2.14"
  },
  "dependencies": {
    "tslib": "^2.0.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sametcelikbicak/library-workspace.git"
  },
  "keywords": [
    "auto",
    "focus",
    "auto focus",
    "auto-focus",
    "angular",
    "frontend",
    "front end",
    "front-end",
    "ngx"
  ],
  "author": "Samet ÇELİKBIÇAK",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/sametcelikbicak/library-workspace/issues"
  },
  "homepage": "https://github.com/sametcelikbicak/library-workspace/blob/main/projects/auto-focus#README"
}
``` 
Bu package.json dosyası içerisinde sizde kendi bilgilerinizi düzenlenleyebilirsiniz.
- **name:** Hazırladığınız paketin adı
- **version:** Paketinizin version bilgisi, semantic version olarak kullanılır ve formatı **<*major*>.<*minor*>.<*patch*>** olarak belirtilir. Bizim örneğimizde versiyon tanımımız **0.0.5** şeklindedir.
- **description:** Paketinizin için bir açıklama bölümüdür.
- **repository:** Paketinizin bulunduğu repo bilgilerini içerir.
- **keywords:** Paketiniz için tanımladığınız keyword(anahtar) kelimeleri içerir.
- **author:** Paketini yayınlayan bilgisini barındırır.
- **license:** Paketinizin lisans bilgisidir.
- **bugs:** Paketinizin issue bilgilerinin takibi için kullanılır.
- **homepage:** yayınlanan paketin ana sayfa bilgisini içerir.

Gerekli düzenlemeler yapıldığına göre şimdide paketimizin **README** dosyasını güncelleyelim. İlgili düzenlemeler yapıldıktan sonra README dosyamızın içeriği aşağıdaki gibi olacaktır.

![auto-focus-readme.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632573117913/ilzlxsnQf.png)

İhtiyacımız olan düzenlemeleri yaptıktan sonra artık hazırladığımız kodumuzu build edip **npm** ortamında yayınlamaya hazır hale getirip yayınla işlemini yapalım. Build işlemini yapmadan önce ihtiyacımız varsa kütüphanemizin versiyon bilgisini güncelleyebiliriz. bu örnek için en son hazırlanan **0.0.5** versiyonunu yükseltip yeniden kütüphanemizi build edip npm üzerinde paylaşalım.Projemizin kök dizinindeyken aşağıdaki komut ile oluşturduğumuz kütüphanemizin olduğu konuma geçelim.

```shell
cd projects/auto-focus
```
Kütüphanemizin olduğu konuma geldiğimize göre şimdide yeni bir patch versiyonunu aşağıdaki komut ile alalım.
```shell
npm version patch
```
Komut çalıştıktan sonra artık yeni versiyonumuz **0.0.6** oldu. Şimdi bu yeni versiyonumuz için bir build yapalım. Öncelikle bulunduğumuz konumdan aşağıdaki komut ile projemizin kök dizinine ulaşalım.
```shell
cd ../..
```
Projemizin kök dizinine geldiğimize göre alt taraftaki komut ile yeni versionumuza ait build işlemimizi yapalım.
```shell
ng build auto-focus --configuration production
``` 
Bu komu çalıştığı zaman projemizde **dist** klasörü oluşur ve içerisinde kütüphanemize ait bir klasör altında build komutu ile derlediğimiz dosyalarımızı görebiliriz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632575360443/3qRC77PJo.png)

Herşey hazır şimdi geriye kalan projemizi npm ortamına göndermek. Öncelikle bir npm hesabınız yok ise [npm](https://www.npmjs.com/) sitesi üzerinden hesap açabilirsiniz. Eğer zaten bir hesabınız var ise projenin bulunduğu kök dizinde terminal yardımıyla **npm login** işlemini yapabiliriz. Ben zaten login olduğum için o işlemi yapmayacağım fakat sizin login olmanız gerektiğinde terminal de npm login komutunu çalıştırınca sırasıyla bizden kullanıcı adı ve şifre isteyecektir. İlgili bilgileri girdikten sonra login işlemi tamamlanmış oluyor. Şifre bilgi girerken yazdıklarımızı terminalde göremeyiz, şifreyi yazıp enter a basınca login işlemi gerçekleşir ve daha sonra bizden mail adresimizi girmemizi bekler. Yönergeleri takip edip süreci tamamladıktan sonra artık paketimizi npm ortamına gönderebiliriz. 
Şimdi kütüphanemizin build olduğunu **dist** klasörünüe geçelim ve npm ortamına gönderme adımına geçelim.
```shell
cd dist/auto-focus/
```
Artık tek yapmamız gereken aşağıdaki komutu çalıştırmak ve paketin npm ortamına gönderilmesini beklemek.
```shell
npm publish --access=public
```
Komutu çalıştırınca aşağıdaki gibi sonucu görebiliriz. Bu komut içinde kullanmış olduğum **--access=public** parametresinin sebebi bizim paketimizde scope kullanmış olmamız yani **@sametcelikbicak** şeklinde bir scope kullanılır ise bunun default paylaşım değeri **private** olduğundan bizde --access=publice parametresini kullanmak durmunda kalıyoruz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632575848630/FOn1YCt-c.png)

![Screen Shot 2021-09-25 at 16.23.42.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632576241084/mKXwRGYmx.png)

Görüldüğü gibi artık paketimiz npm ortamında yayında, şimdi sıra bu paketi kullanmakta, projemizin kök dizininde bir deneme projesi oluşturalım ve paketimizi yükleyip kullanım sonucuna bakalım. Aşağıdaki komut ile test uygulamamızı oluşturabiliriz.
```shell
ng generate application library-test
```
Bu komut çalıştıktan sonra projemiz içinde yeni uygulamamız oluşmuş ve projemizin klasör yapısı aşağıdaki gibi olmuştur.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632577186016/MKYaZEfLY.png)

Test projemizde hazır olduğuna göre ve bu proje bir workspace(çalışma alanı) içinde olduğu için projemizin kök dizininde yeni oluşturduğumuz paketimizi aşağıdaki komut ile yükleyelim.
```shell
npm i @sametcelikbicak/auto-focus
```
Paketi yükledikten sonra şimdi **projects/library-test/src/app/** altındaki **app.module.ts** içerisinde **AutoFocusModule** modülümüzü **AppModule** **imports** listesine ekleyelim. Düzenleme yapıldıktan sonra app.module.ts içeriği aşağıdaki gibi olacaktır.
```typescript
// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AutoFocusModule } from '@sametcelikbicak/auto-focus';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AutoFocusModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
Tanımlama yapıldıkta sonra artık auto-focus directive kullanılabilir duruma gelmiş oluyor. Test uygulamızın **app.component.html** içeriğini de aşağıdaki gibi düzenleyelim.
```html
<!-- app.component.html -->

<div class="container">
  <input placeholder="Auto focus directive does not use" />
  <input ngxAutoFocus placeholder="Auto focus directive is using" />
</div>
```
Birkaç **CSS** işlemi içinde **app.component.scss** içerisinde aşağıdaki düzenlemeleri yapalım.
```css
// app.component.scss

.container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}
input {
  width: 300px;
  margin: 1em;
  height: 20px;
}
```
Artık test için herşey hazır, şimdi test projemizin olduğu dizine aşağıdaki komut ile geçelim.
```shell
cd projects/library-test/
```
Test projemizin olduğu konumda ise alttaki komut ile projemizi çalıştıralım.
```shell
ng serve
```
Projemiz derlendikten sonra ön tanımlı adres olan **http://localhost:4200/** adresinde projemiz hazır ve çalışır durumda olacaktır. Herhangi bir tarayıcı ile ilgili adrese gittiğimizde ise projemizin çalıştığını ve auto-focus directive tanımı olan inputun seçili olarak geldiğini aşağıdaki gibi görebiliriz.

![Screen Shot 2021-09-25 at 16.56.01.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632578166471/VyDIzMNO-.png)

Yaptıklarımızı özetlemek gerekirse, ilk olarak bir workspace oluşturduk, sonra bir library içerisinde ekledik sonrasında ihtiyacımız olan library kodlarını yazdık. Çalışır durumda bir kütüphanemiz olduğunda ise npm ortamında paylaşmak için gerekli adımları yaptık ve paylaştık. Npm ortamındaki paketimizi test etmek için workspace içinde library-test isimli bir application ekledik ve daha sonra npm paketimizi yükleyip uygulamamız aracılığıyla test ettik. Oluşturduğumuz workspace, library ve application için kulladığım kodları ve hazırlayıp paylaştığımız npm paketini aşağıdaki linklerden ulaşabilirsiniz.


[GitHub Repo](https://github.com/sametcelikbicak/library-workspace)

[npm package](https://www.npmjs.com/package/@sametcelikbicak/auto-focus)
