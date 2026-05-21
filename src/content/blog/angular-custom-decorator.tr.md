---
title: "Angular Custom Decorator"
date: "2022-04-03"
description: "Angular projelerinde işleri kolaylaştıran custom decorator'ların nasıl oluşturulacağını ve kullanılacağını pratik örneklerle anlatıyorum."
tags: ["Angular", "TypeScript", "Decorator", "Frontend"]
image: "/blog/angular_decorator_cover.webp"
---

Merhaba,

Bu yazımda Angular'da işimize yarayacak **decorator** kullanımından bahsedeceğim. Bu kullanımı anlatabilmek için bir component oluşturalım ve bu componentin input olarak aldığı parametrelerin zorunlu olması durumunu kontrol edelim.

### Component oluşturma
İlk olarak projemizde aşağıdaki komut ile greeter componentimizi oluşturalım:
```bash
ng g c greeter
```

Component hazır olduğuna göre özelleştirme işlemini yapalım ve bu componentimiz basit olarak verilen bir isim için karşılama mesajı versin. Gerekli düzenlemeleri aşağıdaki gibi yapalım.

##### [greeter.component.html]
```html
<h2>Hello, {{ name }}</h2>
<h3>{{ message }}</h3>
```

##### [greeter.component.ts]
```typescript
import { Component, Input, VERSION } from '@angular/core';

@Component({
  selector: 'app-greeter',
  templateUrl: './greeter.component.html',
  styleUrls: ['./greeter.component.css'],
})
export class GreeterComponent {
  @Input() public name: string;
  @Input() public message: string;
}
```

Görüldüğü gibi basit bir component. Şimdi **name** ve **message** değerlerini zorunlu yapmak istediğimizde iki seçenek kullanabiliriz. Birincisi selector tanımında bunu belirtmek ya da bir decorator yardımı ile bunu belirtmek. Bu konumuzun özelinde decorator oluşturalım ve onu kullanalım. Ayrıca selector tanımında belirttiğimiz zorunluluğun bizim için çok işlevsel olmadığını da göreceğiz.

### Decorator oluşturma
Decorator oluşturmak için projemizde bir **decorators** isimli klasör açıp içerisinde de **required.decorator.ts** isimli bir dosya açıp fonksiyonumuzu yazalım.

##### [required.decorator.ts]
```typescript
export function Required(target: object, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    get() {
      throw new Error(`Attribute '${propertyKey}' is required.`);
    },
    set(value) {
      Object.defineProperty(target, propertyKey, {
        value,
        writable: true,
        configurable: true,
      });
    },
    configurable: true,
  });
}
```

Şimdi yeni hazırladığımız bu `Required` decorator tanımımızı componentimizde kullanalım:

##### [greeter.component.ts]
```typescript
import { Component, Input, VERSION } from '@angular/core';
import { Required } from '../decorators/required.decorator';

@Component({
  selector: 'app-greeter',
  templateUrl: './greeter.component.html',
  styleUrls: ['./greeter.component.css'],
})
export class GreeterComponent {
  @Input() @Required public name: string;
  @Input() public message: string;
}
```

Bu düzenlemeden sonra yeni componentimizi kullanalım ve bize sağladığı zorunluluk kontrolünün sonucunu görelim. Bunun için `app.component.html` içerisinde aşağıdaki düzenlemeyi yapalım:
```html
<h1>{{ title }}</h1>
<hr />
<app-greeter name="Samet" message="Custom decorator"></app-greeter>
```

Bu kullanım sonucu herhangi bir hata bulunmuyor ve ekran çıktımız aşağıdaki gibi oluyor:

![angular-custom-decorator-success](https://cdn.hashnode.com/res/hashnode/image/upload/v1648991434412/J-Vm6eDtv.png)

Artık sıra zorunlu olarak belirttiğimiz alana değer vermeden kullanmaya geldi ve hazırlamış olduğumuz decorator tarafından da uyarı mesajımızı göreceğiz:
```html
<h1>{{ title }}</h1>
<hr />
<app-greeter message="Custom decorator"></app-greeter>
```

![angular-custom-decorator-error](https://cdn.hashnode.com/res/hashnode/image/upload/v1648991620410/UQHHaV_wO.png)

Hata mesajında da görüldüğü gibi bu tarz bir decorator ile istediğimiz gibi özelleştirme yapabiliyoruz. Şimdi de decorator olmadan selector tanımında bir zorunluluk kontrolü yapalım ve onun sonucunu görelim:

##### [greeter.component.ts]
```typescript
@Component({
  selector: 'app-greeter[message]',
  templateUrl: './greeter.component.html',
  styleUrls: ['./greeter.component.css'],
})
export class GreeterComponent {
  @Input() public name: string;
  @Input() public message: string;
}
```

Selector yardımı ile bir alanı zorunlu yaptığımızda aldığımız hata mesajında net olarak hangi alan için bu hatayı verdiğini bulmamız zor, ama custom decorator ile net olarak hangi alanda hata olduğunu görebiliyoruz.

Ayrıca işlemlerimizi loglamak için de bir decorator oluşturabiliriz:

##### [log.decorator.ts]
```typescript
export function Log(params?: { color?: string }): MethodDecorator {
  return function (target: Function, propertyKey: string, descriptor: any) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(
        `%c |-> Entering '${propertyKey}' method`,
        params ? `color:${params.color}` : ''
      );
      console.log(
        `%c "${propertyKey}" method args:${args}`,
        'background:green;color:white'
      );
      const result = originalMethod.apply(this, args);
      console.log(
        `%c <-| Leaving '${propertyKey}' method`,
        params ? `color:${params.color}` : ''
      );

      return result;
    };

    return descriptor;
  };
}
```

Örnek kullanımı:
```typescript
@Component({ ... })
export class AppComponent implements OnInit {
  public title = `Angular Custom Decorator`;

  @Log()
  public ngOnInit(): void {
    this.sayHi('Hi', 'Samet');
  }

  @Log({ color: 'red' })
  public sayHi(message: string, name: string): void {
    console.log(message, name);
  }
}
```

![angular-log-decorator](https://cdn.hashnode.com/res/hashnode/image/upload/v1649688178504/PQdZdmsqM.png)

Konuya ait GitHub ve StackBlitz örneklerine aşağıdan ulaşabilirsiniz:

- [GitHub Repo: Angular Custom Decorator](https://github.com/sametcelikbicak/angular-custom-decorator-usage)
- [StackBlitz Demo](https://stackblitz.com/edit/angular-custom-decorator-usage)
