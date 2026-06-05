---
title: "Angular custom pipe"
date: "2021-08-06"
description: "Angular'da custom bir pipe nasıl tanımlanır ve kullanılır, moment.js paketi ile tarih formatlama örneği."
tags: ["Angular", "TypeScript", "Pipe", "Frontend"]
image: "/blog/angular_custom_pipe_cover.webp"
---

Merhaba,

Bu yazımda Angular da custom bir **pipe** nasıl tanımlanır ve kullanılır onu ele alacağım. Bu yazımla birlikte uygulamalarımızda sıkça lazım olan tarih formatlama işlemini hazırlayacağımız **pipe** ile kontrol edeceğiz.

Ayrıca hazırlayacağımız pipe içinde çok sık kullanılan ve birçok yardımcı özelliği olan **moment.js** paketini kullanacağız ve aşağıdaki komut ile projemize gerekli olan paketini yükleyebiliriz.

```shell
npm install moment
``` 

Paketimizi yükledikten sonra şimdide projemiz içinde kullanacak olduğumuz pipe tanımımızı yapalım.


```typescript
// custom-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';
import myMoment from 'moment';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  public transform(
    date: Moment | Date | string | number,
    format: string = 'DD-MM-YYYY HH:mm'
  ): string {
    return myMoment(date).format(format);
  }
}

``` 

Pipe tanımı yapıldıktan sonra şimdide örnek kullanımımıza bakalım. Bu işlem için bir tarih değişkeni oluşturalım ve o değişkeni önce normal hali ile sonra var olan **date** pipe ile ve son olarak kendi yazdığımız custom pipe ile kullanımlarına bakalım.


```typescript
// app.component.ts
import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = `Angular ${VERSION.major} Custom Pipe`;
  public initialDate: Date = new Date();
}
``` 

Component tanımımızda hazır olduğuna göre şimdi html içeriğine bakalım.

```html
<!-- app.component.html -->
<h1>{{title}}</h1>

Initial Date:
<h4>{{ initialDate }}</h4>

Initial Date with date pipe:
<h4>{{ initialDate | date }}</h4>

Initial Date with custom date pipe:
<h4>{{ initialDate | customDate }}</h4>

Initial Date with custom date pipe and custom format:
<h4>{{ initialDate | customDate: 'YYYY-MM-DDD HH:mm' }}</h4>
``` 

Görüldüğü gibi html içindeki **{{ initialDate | customDate }}** kullanımı ile bizim tanımladığımız default formata göre tarih formatlanıyor ve **{{ initialDate | customDate: 'YYYY-MM-DDD HH:mm' }}** kullanımı ile de istediğimiz gibi formatı anlık olarak değiştirebiliyoruz. Bu tanımlar sonrasında uygulamamız aşağıdaki gibi görünüyor.


![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1628240425540/m8pDFFnoz.png)


Proje ait **StackBlitz** ve **GitHub** linklerine aşağıdan erişebilirsiniz.

[StackBlitz](https://stackblitz.com/edit/angular-custom-pipe-usage?embed=1&file=src/app/app.component.ts)

[GitHub Repo](https://github.com/sametcelikbicak/angular-custom-pipe-usage)
