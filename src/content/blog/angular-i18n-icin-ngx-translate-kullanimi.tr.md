---
title: "Angular i18n için ngx-translate kullanımı"
date: "2021-03-08"
description: "Angular projelerinde çoklu dil desteği (i18n) sağlamak için ngx-translate paketinin kurulumu ve kullanımı."
tags: ["Angular", "i18n", "ngx-translate", "Frontend"]
image: "/blog/angular_i18n_cover.webp"
---

Merhaba,

Bu yazımda bir angular projesinde çoklu dil desteğini nasıl sağlarız ve bunu sağlamak için gerekli olan yöntemlerden birisi olan ** [ngx-translate](http://www.ngx-translate.com/) ** paketini nasıl kullanırız onu inceleyelim.

İlk olarak bir proje oluşturulım ve projemize ngx-translate için gerekli olan paketleri aşağıdaki komutlar yardımı ile yükleyelim.

```shell
npm install @ngx-translate/core --save
``` 
ve

```shell
npm install @ngx-translate/http-loader --save
``` 
Sistemimize gerekli olan paketleri yükledikten sonra artık projemiz içindeki gerekli ayarlamalarımızı yapabiliriz. ngx-translate sistemde default olarak projemiz içindeki **/assets/i18n/** klasörü altında **.json** uzantılı dosyalara bakmaktadır. Eğer istenilirse **TranslateHttpLoader** yardımı ile translate dosyalarımızın konumu ve uzantısı özelleştirilebilinir. Biraz sonra gerekli kodları hazırladığımızda yapılması gereken değişimleri göstereceğim.

Artık gerekli tanımlamaları yapmaya başlayalım. Öncelikle projemizdeki **app.module.ts** içerisinde translate işlemi için gerekli olan konfigürasyon tanımlarını ekleyelim ve bu ekleme ile oluşan dosyamızın son haline bakalım.


```typescript
// app.module.ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: "tr"
    })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
``` 

Kod içinde görüldüğü gibi **HttpLoaderFactory** methodu ile ngx-translate paketinin default tanımlı bilgilerini kullanacağımızı söyledik ve projemizde **/assets/i18n/** klasörü altında **.json** dosyalarının olacağını belirmiş olduk. Eğer default klasör ve dosya uzantısını kullanmayacak isek aşağıdaki gibi bir özelleştirme yapabiliriz.

```typescript
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "/language-files/", "-language.json");
}
``` 
Bu özelleştirme ile ngx-translate paketine bizim translate dosyalarımızın projemizin içindeki **language-files** altında ve **-language.json** uzantısına sahip olduğunu söylemiş olduk. Bu yazımızda özelleştirilmiş klasör altında değil default klasör altında translate dosyalarımı ekleyip işlemimize devam edeceğiz.

Kod içerisinde gördüğünüz aşağıdaki tanımlama ile de ngx-translate paketimize gerekli olan ayarların tanımını vermiş oluyoruz ve default dil olarak **tr** ile Türkçe bilgisini vermiş oluyoruz.

```typescript
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: "tr"
    })
  ],
``` 
**app.module.ts** içindeki tanımlama işlemimiz bittiğine göre artık geri kalan düzenleme ve tanımlama işlemlerimize devam edebiliriz. Şimdi ise projemizde translate dosyalarımı ekleyeceğimiz klasör yapımızı oluşturalım. Bu işlem içinde projemizin altına  **/assets/i18n/** klasörünü oluşturalım ve bu klasör içine de **tr.json**, **en.json** ve **se.json** dosyalarımızı ekleyelim. Eklediğimiz json uzantılı dosyaların isimleri ise bizim translate için kullanacağımız tanımlamalara ait anahtar kelimeler olarak düşünebiliriz. Eklediğimiz translate dosyalarımızın içeriği ise aşağıdaki gibi olacaktır.

Türkçe dil desteği için eklediğimizi değişkenler ve değerleri.
```json
// tr.json
{
    "tr":"Türkçe",
    "en":"English",
    "se":"Svenska",
    "changeLanguage":"Dili değiştir",
    "keywordDefinition":"i18N anahtar kelime tanımı örnekleri",
    "key":"Anahtar",
    "value":"Değer",
    "example1":"Örnek 1",
    "example2.title":"Örnek 2 başlık",
    "example3":{
      "title":"Örnek 3 başlık",
      "title.subtitle":"Örnek 3 alt başlık"
    },
    "example4.withCustomValue":"Örnek 4: {{customValue}}",
    "example5.fromTypeScript":"Örnek 5"
}
``` 
İngilizde dil desteği için hazırladığımız json dosyası

```json
// en.json
{
    "tr":"Türkçe",
    "en":"English",
    "se":"Svenska",
    "changeLanguage":"Change language",
    "keywordDefinition":"i18n keyword definition examples",
    "key":"Key",
    "value":"Value",
    "example1":"Example 1",
    "example2.title":"Example 2 title",
    "example3":{
      "title":"Example 3 title",
      "title.subtitle":"Example 3 sub title"
    },
    "example4.withCustomValue":"Example 4: {{customValue}}",
    "example5.fromTypeScript":"Example 5"
}
``` 
Son olarak bir diğer dil ise İsveççe için hazırladığımız dil dosyamız.

```json
// se.json
{
    "tr":"Türkçe",
    "en":"English",
    "se":"Svenska",
    "changeLanguage":"Ändra språk",
    "keywordDefinition":"i18n exempel på nyckelordsdefinition",
    "key":"Nyckel",
    "value":"Värde",
    "example1":"Exempel 1",
    "example2.title":"Exempel 2 titel",
    "example3":{
      "title":"Exempel 3 titel",
      "title.subtitle":"Exempel 3 texta"
    },
    "example4.withCustomValue":"Exempel 4: {{customValue}}",
    "example5.fromTypeScript":"Exempel 5"
}
``` 
Bu üç dosya içinde bir kaç farklı yöntem ile değişken tanımı yapısını göstermek istedim, bu kullanımlar bizim için oluşturduğumuz projede da kontrollü ve mantıklı çözümler hazırlamamıza yardımcı oluyor.

* Direk bir değişken ve değer kullanımı:  

```json
"tr":"Türkçe"
``` 

* Nokta ile gruplama: 

```json
"example2.title":"Örnek 2 başlık"
``` 

* Obje olarak gruplama: 

```json
 "example3":{
      "title":"Örnek 3 başlık",
      "title.subtitle":"Örnek 3 alt başlık"
    }
``` 
Translate için kullanacağımız dosyalarımız hazır olduğuna göre şimdi artık bu oluşturduğumuz dosyalarımı kullanan örneğimizi hazırlayalım. Projemiz içindeki **app.component.ts** içerisine aşağıdaki gibi kodlarımızı yazalım ve bu kodlarımızı inceleyelim.

```typescript
// app.component.ts
import { Component, VERSION } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public title = `Angular ${VERSION.major} i18n with ngx-translate`;
  public customNumberValue = 12345;

  constructor(public translateService: TranslateService) {
    this.translateService.addLangs(["tr", "en", "se"]);
  }

  public get translationFormTypeScript(): string {
    return this.translateService.instant("example5.fromTypeScript");
  }

  public onChange(selectedLanguage: string): void {
    this.translateService.use(selectedLanguage);
  }
}
``` 
İlk olarak ngx-translate paketi ile bize gelen **TranslateService** servisimizi constructor ile inject edip daha sonra sistemde kullanacak olduğumuz dil tanımlarını aşağıdaki gibi ekliyoruz.

```typescript
  constructor(public translateService: TranslateService) {
    this.translateService.addLangs(["tr", "en", "se"]);
  }
``` 
**["tr", "en", "se"]** tanımında gördüğünüz gibi bu değerler bizim **/assets/i18n/** klasörü altında oluşturduğumuz **.json** uzantılı dosya adları. ngx-translate paketi bu tanımları aldıktan sonra projemiz içinde belirttiğimiz .json uzantılı dosyaların tanımlarına bakarak **addLangs** metodu ile eklediğimiz dil tanımlarına ait json dosyalarını bulup eşleştiriyor. TypeScript tarafında hazırladığımız kodlardan sonra şimdi de HTML tarafanı hazırlayalım ve uygulamamızın son haline bir göz atalım. **app.component.html** içeriği aşağıdaki gibi olacaktır.

```html
<!-- app.component.html -->
<h1>{{ title }}</h1>

<label translate>changeLanguage</label>
<select #language (change)="onChange(language.value)">
    <option *ngFor="let lang of translateService.getLangs()" [value]="lang">{{
        lang | translate
    }}</option>
</select>

<h3>{{ "keywordDefinition" | translate }}</h3>

<table>
	<tr>
		<th translate>key</th>
		<th translate>value</th>
	</tr>
	<tr>
		<td>example1</td>
		<td translate>example1</td>
	</tr>
	<tr>
		<td>example2.title</td>
		<td translate>example2.title</td>
	</tr>
	<tr>
		<td>example3.title</td>
		<td translate>example3.title</td>
	</tr>
	<tr>
		<td>example3.title.subtitle</td>
		<td translate>example3.title.subtitle</td>
	</tr>
	<tr>
		<td>example4.withCustomValue</td>
		<td>{{'example4.withCustomValue' | translate: {customValue:customNumberValue} }}</td>
	</tr>
	<tr>
		<td>example5.fromTypeScript</td>
		<td>{{ translationFormTypeScript }}</td>
	</tr>
</table>
``` 
HTML içeriğinde de göreceğiniz gibi nasıl birden farklı yöntem ile json dosyamızda dil tanımları için değişken eklemesi yaptıysak, html içinde de birden fazla yöntem ile bu değişkenleri kullanıp translate işlemimizi yapabiliyoruz.

* translate directive kullanımı:

```html
	<tr>
		<th translate>key</th>
		<th translate>value</th>
	</tr>
``` 
* translate pipe kullanımı:

```html
	<tr>
		<td>example4.withCustomValue</td>
		<td>{{'example4.withCustomValue' | translate: {customValue:customNumberValue} }}</td>
	</tr>
``` 
* interpolation ile bir değişken yardımı ile translate kullanımı

```html
	<tr>
		<td>example5.fromTypeScript</td>
		<td>{{ translationFormTypeScript }}</td>
	</tr>
``` 
**translationFormTypeScript** değişkenine ait tanım ise .ts dosyamız içerisinde aşağıdaki görünmektedir. Bu tanım için ise translate servisinde tanımlı olan **instant** methodu yardımı ile elimizde var olan key için translate değerini almış oluyoruz.

```typescript
  public get translationFormTypeScript(): string {
    return this.translateService.instant("example5.fromTypeScript");
  }
``` 
Artık tüm tanımlar bittiğine göre uygulamamızın görünümü de aşağıdaki gibi olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1615186399299/9-v9hREDS.png)

Uygulama üzerinde de görüldüğü gibi dil tanımlarının olduğu açılır menüden hangi dili seçersek o dile ait translate değerleri listemizde görülecektir. Örneğin İngilizce seçildiği zaman ekran aşağıdaki gibi olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1615186504026/LRfBd9BcC.png)

Kısa özetlemek gerekirse projemize dil desteği eklemek istersek ngx-translate kolay ve kullanışlı bir çözüm olacaktır. Bu çözüm için kendi istediğimiz ya da paketinin default tanımlarına göre dil dosyalarımızı oluşturmak ve paketimizin bize sağladığı yardımcı servis ve modüller yardımızı ile sistemizinin ayarlamasını yapmak en son olarak da kullanıcı için bir dil seçeneği ekleyip kullanıcın seçtiği dili aktif dil olarak atamasını yapmak. Örnek proje içinde gerekli olan tüm tanımlama ve düzenlemeler mevcuttur. Gerekli olan değişim ve düzenlemeler ile sizde kendi projenizde çoklu dil desteğini sağlayabilirsiniz.

Projeye ait **StackBlitz** ve **GitHub** linklerine aşağıdan erişebilirsiniz.

[StackBlitz](https://stackblitz.com/edit/angular-ngx-translate-i18n?embed=1&file=src/app/app.component.ts)


[GitHub Repo](https://github.com/sametcelikbicak/angular-ngx-translate-i18n)
