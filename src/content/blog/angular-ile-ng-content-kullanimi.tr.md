---
title: "Angular ile ng-content kullanımı"
date: "2021-12-18"
description: "Angular'da ng-content kullanımı ile esnek ve yeniden kullanılabilir bileşenler (components) nasıl oluşturulur."
tags: ["Angular", "ng-content", "Component", "Frontend"]
image: "/blog/angular_ng_content_cover.webp"
---

Merhaba,

Bu yazımda sizlere Angular içinde bulunan <mark>**ng-content**</mark> yapısının kullanımından bahsedeceğim. Bu özellik ile hazırladığımız componentler ile istediğimiz yerde istediğimiz kayıtları gösterebilme imkanında sahip oluyoruz.

## ng-content kullanımı
Angular tarafından sağlanan bu özellik ile ortak kullanıma sahip bir component oluşturup ve bu componenti de belirli parçalara bölerek istediğimiz alanına veri yazamayı kolaylaştırabiliriz. ng-content sayesinde ayrı bir component ya da var olan bir component içerisine başka bir veri eklemesini kolaylaştırmış oluruz.

## Component oluşturma
ng-content kullanımı için bir component oluşturalım ve bu component dört bölüm tasarlayalım. Sol, orta, sağ ve genel bir kullanım alanı olmak üzere dört alana sahip olacak ve her bir alan için belirli bir anahtar yardımı ile verileri göstermemize olanak sağalayacak. Projemiz içinde **src/app** klasörü altına geçip aşağıdaki komut ile yeni componentimizi oluşturalım ve gerekli düzenlemeleri yapmaya başlayalım.
```shell
ng g c content
```
Componentimiz hazır olduğuna göre şimdi html içeriğinde düzenleme yapıp yukarıda belirttiğim alanların oluşturulmasını yapalım. Gerekli düzenleme sonrası html içeriği aşağıdaki gibi olacaktır.
```html
<div class="div-with-selector">
  <div class="content">
    <div class="left">
      <ng-content select="[left]"></ng-content>
    </div>

    <div class="middle">
      <ng-content select="[middle]"></ng-content>
    </div>

    <div class="right">
      <ng-content select="[right-side]"></ng-content>
    </div>
  </div>
</div>

<div class="div-without-selector">
  <ng-content></ng-content>
</div>
```
Yukarıdaki kod içinde görüldüğü gibi <mark>**ng-content**</mark> elemanı ile alanlarımızı oluşturuyoruz. Bu eleman kullanımında belirtiğimiz alanları ise <mark>**select**</mark> kelimesi ile belirtiyoruz. Örnek olarak <mark>**select="[left]"**</mark> ifadesi ile bu componenti kullanırken oluşturduğumuz elemena **left** kelimesini verdiğimiz zaman bu alanda görüneceğini belirtmiş oluyoruz. Örnekleri tamamlayınca daha anlaşılır olacaktır.

Şimdide oluşturduğumuz html içeriğini css ile biraz daha anlaşılır ve bölümlerin hatlarının daha belirginlerştirilmesi için düzenleyelim. Gerekli düzenlemelerden sonra css içeriğide aşağıdaki gibi olacaktır.
```css
div {
  margin: 0.2em;
}

.div-with-selector {
  border: 1px solid red;
  display: flex;
}

.div-without-selector {
  border: 1px solid blue;
}

.content {
  display: flex;
  flex-direction: row;
  border: none !important;
}

.content,
.left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid lime;
}

.content,
.middle {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid magenta;
}

.content,
.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rebeccapurple;
}
```
## Component kullanımı
Artık componentimiz hazır ve şimdi onun kullanımına geçelim. Bu işlem için **app.component.html** içeriğinde biraz düzenleme yapalım ve düzenleme sonrası içeriğimiz aşağıdaki gibi görünecektir.
```html
<h1>{{ title }}</h1>

<app-content>
  <p left>This content shown in the left side</p>

  <p middle>This content shown in the middle</p>

  <p right-side>This content shown in the right side</p>

  <p>
    This content shown alone in <mark><b>div-without-selector</b></mark>
  </p>
</app-content>

<p><b>Normal text without ng-content usage</b></p>
```
Yukarıda görüldüğü gibi **p** elemanı kullanımında yanına **left** kelimesinide ekledik bu sayede yazdığımız içerik hazırladığımız component içinde sol tarafda görünecek. **This content shown alone in ** ile başlayan yazının olduğu **p** elemanı kullanımında ise hiçbir özel kelime kullanmadık bu yazıda component içeriğimizde en alta kendi başına görünecektir. Yukarıda kodda görüldüğü gibi tek yaptığımız oluşturmuş olduğumuz <mark>**app-content**</mark> componentini çağırmak ve içeriğine değerler eklemek, bu değerleri özel bir ayraç olmadan kullandığımızda sadece normal içerik olarak görünecekler. Eğer onlara özel bir ayraç verirsek, yazdığımız değerler component içindeki özel alanlarda görünecektir.
Şimdide component kullanımımızda değerlerin daha belirgin olması için aşağıdaki css değişimini app.component.css içerisinde yapalım ve düzenleme sonrası css bilgisinin aşağıdaki gibi olduğunu görelim.
```css
p {
  font-size: 20px;
  text-align: center;
}

h1 {
  text-align: center;
}
```
## Uygulama ekran görüntüsü
Uygulamamızı çalıştırdığımız zaman aşağıdaki gibi görünecektir.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1639815844136/WbQLOTL61.png)

## Kaynak kod ve demo adresi
Projenin **StackBlitz** ve **GitHub** linklerine aşağıdan erişebilirsiniz.

[StackBlitz](https://stackblitz.com/edit/angular-ng-content-usage?embed=1&file=src/app/content/content.component.html)

[GitHub Repo](https://github.com/sametcelikbicak/angular-ng-content-usage)

