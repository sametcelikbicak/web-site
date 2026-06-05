---
title: "HTML & CSS & TypeScript"
date: "2022-10-23"
description: "Web uygulaması için ihtiyacımız olan üç temel yapı olan HTML & CSS & JavaScript kullanımından ve TypeScript ile geliştirmeyi nasıl yapacağımızdan bahsediyorum."
tags: ["HTML", "CSS", "TypeScript", "Frontend"]
image: "/blog/html_css_ts_cover.webp"
---

Merhaba,

Bu yazımda size bir web uygulaması için ihtiyacımız olan üç temel yapı olan HTML & CSS & JavaScript kullanımından ve bu üç yapı için JavaScript yerine TypeScript ile geliştirmeyi nasıl yapacağımızdan kısaca bahsedeceğim. İlk olarak bir uygulamayı alt yapısını JavaScript ile oluşturup sonra ise aynı yapıyı TypeScript ile oluşturacağız.

### HTML & CSS & JavaScript ile proje oluşturma
İlk olarak istediğimiz bir yerde projemiz için bir klasör oluşturalım.
```shell
mkdir html-css-javascript
```
Klasörümüz hazır olduğuna göre sırasıyla o klasöre geçip ihtiyacımız olan dosyaları oluşturalım.
```shell
cd html-css-javascript
touch index.html
touch style.css
touch app.js
```
İlgili dosyaları oluşturduktan sonra klasör yapımız aşağıdaki gibi olacaktır.
```
.
├── app.js
├── index.html
└── style.css
```
İlgili dosyalarımızın içeriği de aşağıdaki gibi olacaktır.

##### [index.html]
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>HTML & CSS & JavaScript</title>
  </head>
  <body>
    <div class="container">
      <h1>HTML & CSS & JavaScript</h1>

      <button id="counter">Click Me!</button>
    </div>
    <script src="app.js"></script>
  </body>
</html>
```

##### [style.css]
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

button {
    width: 150px;
    height: 150px;
    font-size: 25px;
}

.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

##### [app.js]
```javascript
let count = 1;

const counterButton = document.getElementById("counter");

counterButton.addEventListener("click", () => {
    counterButton.innerText  = `Click: ${count++}`;
})
```

Uygulamamıza ilk baktığımızda aşağıdaki gibi görünecektir.

![initial-js](https://cdn.hashnode.com/res/hashnode/image/upload/v1665671822656/zU8PX-4vP.png)

Tıklama işlemi yaptığımızda da sayının arttığını görebiliriz.

![after-some-click-js](https://cdn.hashnode.com/res/hashnode/image/upload/v1665671911685/ZtAOnDx0d.png)

JavaScript ile ilgili olan geliştirmemiz tamamlandı. Şimdi sırada aynı yapıyı TypeScript ile hazırlamakta.

### HTML & CSS & TypeScript ile proje oluşturma
Yine bir önceki javascript kısmında olduğu gibi istediğimiz bir yerde projemiz için bir klasör oluşturalım.
```shell
mkdir html-css-typescript
```
Klasörümüz hazır olduğuna göre sırasıyla o klasöre geçip ihtiyacımız olan dosyaları oluşturalım.
```shell
cd html-css-typescript
touch index.html
touch style.css
touch app.ts
```
Bu aşamadan sonra ilk işlemden farklı olarak yazdığımız TypeScript kodlarının JavaScript'e dönüştürülmesi için ve TypeScript ile kodlarımızı yazabilmemiz için projemize TypeScript eklememiz gerekiyor. Bu işlem için ilk olarak **package.json** dosyasını oluşturmamız ve sonrasında da TypeScript yüklememizi yapmamız gerekiyor. Aşağıdaki komutlarla gerekli düzenlemeyi yapabiliriz.
```shell
npm init -y
npm install -D typescript
npx tsc --init
```
Bu kurulumlardan sonra klasör yapımız aşağıdaki gibi olacaktır.
```
.
├── app.ts
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── style.css
└── tsconfig.json
```
İlgili dosyalarımızın içeriği de aşağıdaki gibi olacaktır.

##### [index.html]
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>HTML & CSS & TypeScript</title>
  </head>
  <body>
    <div class="container">
      <h1>HTML & CSS & TypeScript</h1>

      <button id="counter">Click Me!</button>
    </div>
    <script src="./lib/app.js"></script>
  </body>
</html>
```

##### [style.css]
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

button {
    width: 150px;
    height: 150px;
    font-size: 25px;
}

.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

##### [app.ts]
```typescript
let count = 1;

const counterButton = document.getElementById("counter") as HTMLButtonElement;

counterButton.addEventListener("click", () => {
    counterButton.innerText  = `Click: ${count++}`;
})
```

##### [package.json]
```json
{
  "name": "html-css-typescript",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript": "^4.8.4"
  }
}
```
Yukarıda görebileceğiniz gibi TypeScript kodlarımızı derleyip JavaScript haline dönüştürülmesi için `scripts` bölümüne `dev` isimli bir tanımlama yaptım ve TypeScript derleme işlemi için `tsc` komutunun çalıştırılmasını sağladım. Bu sayede **tsconfig.json** içerisinde vereceğimiz `outDir` değerindeki klasörde bizim için derlenmiş JavaScript dosyamız oluşacaktır. Oluşan bu dosya `index.html` içerisindeki `script` bölümünde kullanıldı.

##### [tsconfig.json]
```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./lib",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true
  }
}
```
Tüm düzenlemelerden sonra uygulamanın olduğu terminalde aşağıdaki komut ile TypeScript kodlarımızı derleyip sonucuna bakalım.
```shell
npm run dev
```
Yukarıdaki komutu çalıştırdıktan sonra klasör yapımız aşağıdaki gibi olacaktır.
```
.
├── app.ts
├── index.html
├── lib
│   ├── app.d.ts
│   └── app.js
├── node_modules
├── package-lock.json
├── package.json
├── style.css
└── tsconfig.json
```

Uygulamamıza ilk baktığımızda aşağıdaki gibi görünecektir.

![initial-ts](https://cdn.hashnode.com/res/hashnode/image/upload/v1665672479722/Rz5ZqRgtf.png)

Tıklama işlemi yaptığımızda da sayının arttığını görebiliriz.

![after-some-click-ts](https://cdn.hashnode.com/res/hashnode/image/upload/v1665672495217/Los3Zwxyo.png)

Yukarıdaki örnekte görebileceğiniz gibi basit bir uygulama için TypeScript kullanımı öğrenmiş olduk. Daha büyük ve kompleks uygulamalarda TypeScript kullanmak için hazırlamış olduğum farklı farklı bundler içeren aşağıdaki templateleri kullanabilirsiniz.

- [TypeScript Vite Template](https://github.com/sametcelikbicak/typescript-vite)
- [TypeScript Parcel Template](https://github.com/sametcelikbicak/typescript-parcel)
- [TypeScript Snowpack Template](https://github.com/sametcelikbicak/typescript-snowpack)
- [TypeScript Rollup Template](https://github.com/sametcelikbicak/typescript-rollup)

Eğer istediğiniz an herhangi bir template ile proje geliştirmek isterseniz hazırlamış olduğum TypeScript template CLI'ına göz atabilirsiniz.

![tsci](https://raw.githubusercontent.com/sametcelikbicak/tsci/main/assets/cli.gif)

- [tsci - npm package](https://www.npmjs.com/package/tsci)
