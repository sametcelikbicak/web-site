---
title: "Angular form kullanımı"
date: "2022-02-09"
description: "Angular projelerinde form kullanımı, Reactive Forms ve validasyon işlemleri ile kolay kullanıcı arayüzü yönetimi."
tags: ["Angular", "Reactive Forms", "Forms", "Frontend"]
image: "/blog/angular_form_usage_cover.webp"
---

Merhaba,

Bu yazımızda Angular ile form kullanarak bir kullanıcı arayüzünü nasıl kolay, basit ve işlevsel olarak hazırlayabileceğimize bakacağız. Genel olarak kullanıcıdan kullanıcı adı, email ve şifre bilgilerini almak istediğimizde form kullanmadığımız durumda birer değişken tanımı yapmamız gereklidir. Oluşturduğumuz değişkenler ile kullanıcıdan aldığımız bilgileri kontrol edip işlemlerimize devam edebiliriz. Bu yöntem ne kadar bizim için yeterli ve kullanılabilir olsa da uygulamamız büyüdüğünde ve artık kullanıcıdan daha fazla bilgi almamız gerektiğinde her yeni bilgi için yeniden bir değişken oluşturmamız gerekecektir.

Form kullanımı yaptığımızda ise sadece form için kullanacağımız nesne içinde yeniden bir tanım yapmamız yeterli olacaktır ve tüm ihtiyacımız olan değişkenler tek bir alanda tanımı ve kontrol edilebilir olacaktır.

İlk olarak değişken kullanarak tanımlarımızı yapalım ve hem component hemde template tarafındaki tanımlarımızı görelim.

```typescript
  public username: string = 'user';
  public email!: string;
  public password!: string;
```
Tanımlarını component içinde yaptıktan sonra template içinde de aşağıdaki gibi bir tanım olacaktır.
```html
<label>Username:</label>
<input [(ngModel)]="username" />

<label>Email:</label>
<input [(ngModel)]="email" />

<label>Password:</label>
<input [(ngModel)]="password" />
```
Yukarıdaki kodda görüldüğü gibi component içinde yaptığımız tanımları <mark><strong>[(ngModel)]</strong></mark> yapısı ile kullanmamız gerekiyor ve bu kullanım ile iki taraflı veri alışverişi olduğu için component tarafında hazırladığımız default değer ekranda görünüyor ve kullanıcını girdiği bilgiyide component tarafında erişebiliyoruz.

Şimdide form kullanımı ile yapmamız gereken tanıma hızlıca bakalım. Component içinde bir form değişkeni ve bu değişkene değer atamak için yardımcı bir method tanımını göreceğiz.

```typescript
public form!: FormGroup;

public ngOnInit(): void {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      username: this.formBuilder.control('user'),
      email: this.formBuilder.control(''),
      password: this.formBuilder.control(''),
    });
  }
```
Template içinde de kullanımı aşağıdaki gibi olacaktır.
```html
<form [formGroup]="form">
  <label>Username:</label>
  <input formControlName="username" />

  <label>Email:</label>
  <input formControlName="email" />

  <label>Password:</label>
  <input formControlName="password" />
</form>
<div>
```
Yukarıdaki kullanımda iki önemli nokta var birincisi değerlerimizi <mark><strong>form</strong></mark> etiketi içinde yazmalıyız ve ikinci olarak değişkene erişmek içinde <mark><strong>formControlName</strong></mark> değerini kullanmalıyız.

Tüm bu tanımlamalardan sonra component içeriğimiz aşağıdaki gibi olacaktır.
```typescript
import { Component, OnInit, VERSION } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public title: string = `Angular ${VERSION.major} form usage`;
  public username: string = 'user';
  public email!: string;
  public password!: string;
  public form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.form = this.createForm();
  }

  public submitVariables(): void {
    console.log({
      username: this.username,
      email: this.email,
      password: this.password,
    });
  }

  public submitForm(): void {
    console.log(this.form.value);
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      username: this.formBuilder.control('user'),
      email: this.formBuilder.control(''),
      password: this.formBuilder.control(''),
    });
  }
}
```
Template içeriğimizde aşağıdaki gibi olacaktır.
```html
<h1>{{ title }}</h1>

<h2>Variable usage</h2>
<label>Username:</label>
<input [(ngModel)]="username" />

<label>Email:</label>
<input [(ngModel)]="email" />

<label>Password:</label>
<input [(ngModel)]="password" />
<div>
  <button (click)="submitVariables()">Submit</button>
</div>

<h2>Reactive form usage</h2>
<form [formGroup]="form">
  <label>Username:</label>
  <input formControlName="username" />

  <label>Email:</label>
  <input formControlName="email" />

  <label>Password:</label>
  <input formControlName="password" />
</form>
<div>
  <button (click)="submitForm()">Submit</button>
</div>
```
Bu aşamaya kadar her iki yöntemde basit ve kullanışlı görünüyor, şimdi şifre alanına bir kontrol ekleyip bu kontrol için gerekli yapıları hazırladığımızda form kullanımın ne kadar kullanışlı olduğunu göreceğiz. Ekleyeceğimiz kontrol şifre alanının minimum 4 karakter girme zorunluluğu olacaktır. Eğer şifre alanında 4 karakterden az değer girilirse <strong>Submit</strong> butonunu pasif yapacağız, eğer 4 karakter ve daha fazlası bir değer girilirse butonu aktif hale getireceğiz. Bu işlem için sistemde hazır olan validator fonksiyonlarını kullanabiliriz. Gerekli düzenlemelerden sonra component içeriğimiz aşağıdaki gibi olacaktır.
```typescript
import { Component, OnInit, VERSION } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public title: string = `Angular ${VERSION.major} form usage`;
  public username: string = 'user';
  public email!: string;
  public password!: string;
  public form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.form = this.createForm();
  }

  public submitVariables(): void {
    console.log({
      username: this.username,
      email: this.email,
      password: this.password,
    });
  }

  public submitForm(): void {
    console.log(this.form.value);
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      username: this.formBuilder.control('user'),
      email: this.formBuilder.control(''),
      password: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }
}
```
Aynı şekilde template içeriğimizde aşağıdaki gibidir.
```html
<h1>{{ title }}</h1>

<h2>Variable usage</h2>
<label>Username:</label>
<input [(ngModel)]="username" />

<label>Email:</label>
<input [(ngModel)]="email" />

<label>Password:</label>
<input [(ngModel)]="password" />
<div>
  <button (click)="submitVariables()" [disabled]="password?.length < 4">
    Submit
  </button>
</div>

<h2>Reactive form usage</h2>
<form [formGroup]="form">
  <label>Username:</label>
  <input formControlName="username" />

  <label>Email:</label>
  <input formControlName="email" />

  <label>Password:</label>
  <input formControlName="password" />
</form>
<div>
  <button (click)="submitForm()" [disabled]="form.invalid">Submit</button>
</div>
```
Görüldüğü gibi değer değişken ile kontrol işlemi yaparsak <strong>[disabled]="password?.length < 4"</strong> değeri ile kontrol ekleyebiliriz aynı şekilde form kullanımında da <strong>[disabled]="form.invalid"</strong> şeklinde kontrolümüzü yazabiliriz. Eğer formumuzada birden fazla validator fonksiyonu kullanırsak ikinci yöntemdeki kontrol bizim için yeterli olacaktır ve değişken kullanımında bir başka koşul daha eklememiz gerekecektir.

Bu örnek form kullanımı sonucu uygulamamız aşağıdaki gibi görünecektir ve ilk aşamada şifre girilmediği ve 4 karakterden küçük olduğu için buton pasif olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1644431446902/CMJLAuNwM.png)

Uygulamamızdaki alanlara değer girdiğimizde ve submit butonlarına bastığımızda sonuçlarda aşağıdaki gibi olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1644431641127/IGUrSxCSV.png)
Artık gerekli olan bazı kontrollerini öğrendiğimize göre ihtiyaçlarınıza göre kullanımları özelleştirip geliştirebilirsiniz.

Projenin <strong>StackBlitz</strong> ve <strong>GitHub</strong> linklerine aşağıdan erişebilirsiniz.

[StackBlitz](https://stackblitz.com/edit/angular-form-usage?devtoolsheight=33&embed=1&file=src/app/app.component.html)

[GitHub Repo](https://github.com/sametcelikbicak/angular-form-usage)
