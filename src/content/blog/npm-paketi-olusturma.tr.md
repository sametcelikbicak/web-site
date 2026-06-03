---
title: "Npm paketi oluşturma"
date: "2021-01-22"
description: "Kendi NPM paketinizi nasıl hazırlayıp yayınlayacağınızı anlatan adım adım TypeScript paketi oluşturma rehberi."
tags: ["NPM", "TypeScript", "JavaScript", "Package"]
image: "/blog/npm_paketi_olusturma_cover.webp"
---

Merhaba,

Bu yazımda bir npm paketinin nasıl hazırlanıp paylaşıldığına bakalım.  npm **N**ode **P**ackage **M**anager kısaltmasıdır ve basit olarak JavaScript programlama dili için bir paket yöneticisidir. Bir çok geliştirici ve firmalar tarafından hazırlanan faydalı ve işlevsel paketler bu  [npm](https://www.npmjs.com/) platformu üzerinde paylaşılır ve ihtiyacı olan yazılımcıların kullanımına sunulur.

Şimdi bizde kendi ihtiyacım olan ve başka yazılımcıların da ihtiyacı olabileceğini düşündüğüm bir fonksiyonu npm paketi olarak hazırlayıp yayınlayalım. Bizim ihtiyacımız olan bir enum bilgilerini array olarak kullanmamızı sağlayacak bir fonksiyon. Artık adım adım bu fonksyionumuzu hazırlayıp ve yayınlama işlemini tamamlayalım.

Kodlamaya başlamadan önce sistemimizde node ve npm yüklü olup olmadığına bakmamız gerekliyor, eğer yüklü değilse  [Node.js](https://nodejs.org/en/) adresinden sizin için uygun versiyonu yükleyebilirsiniz. Aşağıdaki komutların sonucu sizin versiyonunuza göre değişiklik gösterebilir. Bir terminal açıp komutları çalıştabiliriz.

Node versiyonunu öğrenmek için;
```shell
~ node -v
v10.16.0
```

Npm versiyonunu öğrenmek için;
```shell
~ npm -v
6.14.8
```
Artık geliştirmeye hazırız, ilk olarak yayınlayacak olduğumuz paket adını seçelim ve bu isimle bir klasör oluşturalım ve ilgili klasör içine geçip orada git repomuzu oluşturup ilk commitimizi yapalım.

```shell
~ mkdir enum2array
~ cd enum2array
~ git init
~ echo "# Enum2Array" >> README.md
~ git add .
~ git commit -m "Initial commit"
``` 
Lokalde çalışacağımız git repomuzda hazır. Şimdi bu değişikleri saklayacağımız remote repomuzu hazırlayalım.  [GitHub](https://github.com)  üzerinde oluşturduğumuz yeni repomuz ile lokalde bulunan repomuzu eşitleyelim. Bunun için **git remote add origin < Remote repository url >** komutunu kullanabiliriz ve ben aşağıda kendi repomun bağlantısını sağladım ve lokal repomu remote da bulunan GitHub adresime gönderdim.

```shell
~ git remote add origin https://github.com/sametcelikbicak/enum2array.git
~ git push -u origin master
``` 
Artık paketimizi oluşturmaya devam edebiliriz. Şimdi sırada **package.json** dosyasını oluşturmak ve ihtiyacımız olan paketleri projemiz içine yüklemek var. Bunun için yine terminalde aşağıdaki komutu çalıştırıp default değerler ile birlikte package.json dosyamızı oluşturalım.

```shell
~ npm init -y
``` 
Bu işlemden sonra projemizin kök dizinine paketi oluşturduktan sonra gereksiz olan ve remote repomuza da göndermeyeceğiz dosyalarımızı göz ardı etmek için **.gitignore** dosyasını ekleyelim ve ilk olarak için **node_modules** klasörünü koyalım.

```shell
~ echo "node_modules" >> .gitignore
``` 

Şimdi de typescript paketini aşağıdaki komutla projemize ekleyelim.

```shell
~ npm install --save-dev typescript
``` 
Paket yükleme işlemi bittikten sonra projemizin kök dizininde **tsconfig.json** konfigürasyon dosyasını ekleyip içine aşağıdaki bilgileri yazabiliriz.

```json
//tsconfig.json
{
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "declaration": true,
      "outDir": "./lib",
      "strict": true
    },
    "include": ["src"],
    "exclude": ["node_modules"]
  }
``` 
Bu aşamadan sonra da kodumuzu şekillendirmek ve için **prettier** ve **tslint** paketlerinin kurulumunu yapalım. Aşağıdaki komut ile bu kurulumu yapabiliriz.

```shell
~ npm install --save-dev prettier tslint tslint-config-prettier
``` 
İlgili kurulumlar tamamlandıktan sonra şimdide bu iki paket için gerekli konfigürasyon dosyalarını ekleyelim. İlk olarak **tslint.json** dosyasını tanımlayalım ve içerisine aşağıdaki bilgileri ekleyeylim.

```json
//tslint.json
{
    "extends": ["tslint:recommended", "tslint-config-prettier"]
}
``` 
Şimdide prettier için **.prettierrc** dosyasını ekleyip içerisine aşağıdaki tanımı ekleyelim.

```json
//.prettierrc
{
    "printWidth": 120,
    "trailingComma": "all",
    "singleQuote": true
}
``` 
Son olarak derlenen dosyaları remote repositorye göndermemek için **.gitignore** dosyasına **/lib** bilgisini ilave edelim. Şimdide npm paketimizi göndereceğimiz zaman sadece derlenen dosyaların gitmesi için **package.json** içerisinde aşağıdaki tanımı ekleyeylim.

```json
"files": ["lib/**/*"]
``` 
Bu işlemden sonra artık projemizi derlemek formatlamak ve npm üzerinde yayınlamak için gerekli olan script tanımlarınıda package.json içerisine ekleyelim. Kodlar aşağıdaki gibi olacaktır.

```json
//package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" ",
    "lint": "tslint -p tsconfig.json",
    "prepare": "npm run build",
    "prepublishOnly": "npm run lint",
    "preversion": "npm run lint",
    "version": "npm run format && git add -A src",
    "postversion": "git push && git push --tags"
  },
``` 
Bu aşamadan sonra npm için gerekli olan diğer tanımlamalarıda package.json içerisine ekledikten sonra package.json dosyamızın son hali aşağıdaki gibi olacaktır.

```json
//package.json
{
  "name": "enum2array",
  "version": "1.0.1",
  "description": "A function to help converting enums to an array",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" ",
    "lint": "tslint -p tsconfig.json",
    "prepare": "npm run build",
    "prepublishOnly": "npm run lint",
    "preversion": "npm run lint",
    "version": "npm run format && git add -A src",
    "postversion": "git push && git push --tags"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sametcelikbicak/enum2array.git"
  },
  "keywords": [
    "enum",
    "array",
    "enum to array",
    "enum2array"
  ],
  "author": "Samet ÇELİKBIÇAK",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/sametcelikbicak/enum2array/issues"
  },
  "homepage": "https://github.com/sametcelikbicak/enum2array#readme",
  "devDependencies": {
    "prettier": "^2.2.1",
    "tslint": "^6.1.3",
    "tslint-config-prettier": "^1.18.0",
    "typescript": "^4.1.3"
  },
  "files": [
    "lib/**/*"
  ]
}
``` 
Artık tüm hazırlıkları yaptık şimdi paketimiz için gerekli kodumuzu yazalım. Proje kök dizini altında **src** adında bir klasör açıp onun altında da kodumuzu yazacağımız **index.ts** dosyasının eklemesini yapalım. Gerekli klasör ve dosya ekleme işleminden sonra kodumuzu index.ts içinde yazalım. Kodumuzun sonra hali aşağıdaki gibi olacaktır.

```typescript
//index.ts
import { ArrayValue, IArrayValue } from './array-value';

export function enum2array(enumObject: any): IArrayValue[] {
  if (Object.keys(enumObject).some((value) => Number(value))) {
    return Object.keys(enumObject)
      .filter((value) => isNaN(Number(value)) === false)
      .map((key) => new ArrayValue(enumObject[key], Number(key)));
  }

  return Object.keys(enumObject).map((key) => new ArrayValue(key, enumObject[key]));
}
``` 
Benim eklediğim kodda arıyaca bir class tanımına da ihtiyaç olduğu için yine src klasörü altında **array-value.ts** adında bir dosya ekleyip içine de aşağıdaki tanımlayı yazdım.

```typescript
//array-value.ts
export interface IArrayValue {
  readonly title: string;
  readonly value: any;
}

export class ArrayValue implements IArrayValue {
  public readonly title: string;
  public readonly value: any;

  constructor(title: string = '', value: any = '') {
    this.title = title;
    this.value = value;
  }
}
``` 
Herşeyimiz artık hazır. Şimdi yazdığımız kodu derleyelim ve oluşan JavaScript kodumuza bakalım. Package.json içine eklediğimiz build scriptini çalıştıralım.

```shell
~ npm run build
``` 
Kodlarımız build olduktan sonra proje kök dizininde **/lib** adında bir klasör oluşacak ve altına yazdığımız TypeScript kodlarının JavaScript olarak derlenmiş hallerini ekleyecek.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1611297318858/ftflwNcA6.png)

Projemiz artık npm e gönderilmek için hazır, bunu yapmadan önce npm package sayfasında görünecek olan **README.md** dosyamızı güncelleyelim.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1611297715220/gvb3BY4J1.png)

Herşey hazır şimdi geriye kalan projemizi npm ortamına göndermek. Öncelikle bir npm hesabınız yok ise  [npm](https://www.npmjs.com/) sitesi üzerinden hesap açabilirsiniz. Eğer zaten bir hesabınız var ise projenin bulunduğu kök dizinde terminal yardımıyla **npm login** işlemini yapabiliriz. Terminal de npm login komutunu çalıştırınca sırasıyla bizden kullanıcı adı ve şifre isteyecektir. İlgili bilgileri girdikten sonra login işlemi tamamlanmış oluyor. Şifre bilgi girerken yazdıklarımızı terminalde göremeyiz, şifreyi yazıp enter a basınca login işlemi gerçekleşir ve daha sonra bizden mail adresimizi girmemizi bekler. 

```shell
~ npm login
Username: sametcelikbicak
Password:
Email: (this IS public) sametcelikbicak@outlook.com
Logged in as sametcelikbicak on https://registry.npmjs.org/.
``` 
Artık başarılı bir şekilde npm sistemine login olduk. Artık yazdığımız paketi npm ortamına gönderebiliriz. Yapmamız gereken tek şey terminalde aşağıdaki komutu çalıştırmak.

```shell
~ npm publish
``` 
Bu komutun ardında projemiz npm için hazırlanıp npm ortamına publish edilir. Adım adım yapılan işlemleri aşağıda görebilirsiniz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1611298491877/aCD7h00Hl.png)

Publish işleminden sonra npm ortamında paketimiz ile ilgili detaylar aşağıdaki gibi görünmektedir.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1611298562207/irxGQF80G.png)

Artık paketimiz yayınlandı ve başkaları tarafından da kullanıma hazır. Tüm npm paketlerinde olduğu gibi aşağıdaki komut ile oluşan paketimizi ihtiyaç anında projenize ekleyip kullanabilirsiniz.

```shell
~ npm i enum2array
``` 
Paketimiz yayınlandıktan sonra yeni bir özellik veya bir düzenleme yaptığımızda ise tüm değişikliklerimiz commit yaptıktan sonra aşağıdaki komut ile yeni bir npm paket versiyonu oluşturup yeniden npm publish komutu ile güncel paketimizi npm ortamına gönderebiliriz.

```shell
~ npm version patch
``` 
Bu komutu test etmek için küçük bir değişiklik yapalım projemizde sonra yeni bir npm  versiyonu oluşturup yayınlayalım. Şuan ki versiyonumuz **1.0.2** hemen değişiklik yapıp **npm version patch** komutu sonrası olanlara bakalım. Aşağıdaki görüleceği gibi yeni versiyonumuz hazır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1611299145617/ljVNVUTac.png)

Artık en güncel versiyonumuzu npm ortamına yeniden npm publish komutunu çalıştırarak gönderebiliriz. Her yeni yaptığımız düzenleme sonrası istediğimiz zaman npm version patch komutu ile yeni bir paket versiyonu oluşturup onuda npm publish ile npm ortamına gönderip ihtiyacı olanların kullanımına sunabiliriz.

Aşağıda projenin ve paketin erişim bilgilerini görebilirsiniz.

**Proje** 

[GitHub Repo](https://github.com/sametcelikbicak/enum2array)

**Paket**

[NPM Package](https://www.npmjs.com/package/enum2array)
