---
title: "Angular Absolute Import/Path"
date: "2022-08-06"
description: "Angular projelerinde absolute import/path kullanımının avantajlarından ve tsconfig.json ile nasıl yapılandırılacağından bahsediyorum."
tags: ["Angular", "TypeScript", "Clean Code", "Frontend"]
image: "/blog/angular_absolute_path_cover.webp"
---

Merhaba,

Bu yazımda size Angular projelerinde normal import yerine absolute import/path kullanımından bahsedeceğim. Bu düzenleme sayesinde projemizdeki her typescript dosyası içindeki import satırlarındaki karmaşa giderilmiş ve tüm importlarımız gruplanmış olacak.

Örnek olarak bir import işleminde **"../../../../../models/model-a"** yerine **"@models/model-a"** import işlemi daha okunaklı ve düzenli olacaktır. Bu tarz path tanımları ile projemizde istediğimiz gibi gruplamayı kolaylıkla yapabiliriz ve kod okunabilirliğini artırabiliriz.

Yukarıdaki gibi bir düzenleme yapmak için tek yapmamız gereken **tsconfig.json** dosyası içindeki `baseUrl` ve `paths` değerlerini düzenlemek.

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@environments/*": ["./src/environments/*"],
      "@models/*": ["./src/app/shared/models/*"],
      "@services/*": ["./src/app/shared/services/*"]
    }
  }
}
```

Yukarıdaki düzenlemede görüldüğü gibi ilk olarak `baseUrl` değerine `"./"` değerini veriyoruz. Daha sonra ise istediğimiz gruplama için `paths` tanımlarına değerlerimizi ekliyoruz. Örnek olarak proje içinde tanımlamış olduğumuz tüm modellerimizi `@models` grubu altına toplayabiliriz ve bunun için eklememiz gereken `"@models/*": ["./src/app/shared/models/*"]` gibi tek satır bir değer.

Bu tanımlamada önemli olan `"@models/*":` bilgisi bizim için gruplama yapacağımız klasör bilgisi, `["./src/app/shared/models/*"]` ise yapmış olduğumuz tanımlamanın hangi klasörler için geçerli olacağıdır.

Örnek bir projemizde klasör ağacımız aşağıdaki gibi olduğunda yukarıdaki path tanımlarımız daha anlaşılır olacaktır.

```
src
├── app
│   ├── app.component.ts
│   ├── app.module.ts
│   └── shared
│       ├── models
│       │   ├── index.ts
│       │   ├── model-a.ts
│       │   └── model-b.ts
│       └── services
│           ├── a.service.ts
│           └── b.service.ts
├── assets
├── environments
│   ├── environment.prod.ts
│   └── environment.ts
├── favicon.ico
├── index.html
├── main.ts
├── polyfills.ts
├── styles.scss
└── test.ts
```

Gerekli tanımlamalardan sonra ise `app.component.ts` içerisinde örnek bir kullanımını görebiliriz.

```typescript
import { Component, VERSION } from '@angular/core';

// Normal import
// import { ModelA, ModelB } from './shared/models'; // Barrel usage group imports
// import { AService } from './shared/services/a.service';
// import { BService } from './shared/services/b.service';

// Absolute path import
import { ModelA, ModelB } from '@models/index'; // Barrel usage group imports
import { AService } from '@services/a.service';
import { BService } from '@services/b.service';

@Component({
  selector: 'app-root',
  template: `<h1>{{title}}</h1>`
})
export class AppComponent {
  public title: string = `Angular ${VERSION.major} Absolute Path`;

  public modelA: ModelA;
  public modelB: ModelB;

  constructor(private aService: AService, private bService: BService) {
    console.log(this.aService.serviceName());
    console.log(this.bService.serviceName());

    this.modelA = new ModelA("Model A instance");
    this.modelB = new ModelB("Model B instance");
  }
}
```

Örnek projenin GitHub linki aşağıdaki gibidir. Örnek tanımlamalara ve kullanımlara bakabilirsiniz.

- [GitHub Repo: Angular Absolute Path](https://github.com/sametcelikbicak/angular-absolute-path)
