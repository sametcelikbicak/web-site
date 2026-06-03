---
title: "Angular ile NGRX kullanımı"
date: "2021-12-09"
description: "Angular projelerinde NgRx kullanarak State Management işlemleri nasıl yapılır? Action, Reducer ve Selector tanımları."
tags: ["Angular", "NgRx", "State Management", "Frontend"]
image: "/blog/angular_ngrx_usage_cover.webp"
---

Merhaba,

Bu yazımda Angular projelerimizde State Management işlemleri için **NgRx** kullanımına bakacağız. NgRx kullanımı ve gerekli olan proje oluşturma işlemlerini aşağıdaki adımları takip ederek yapabilirsiniz. Bu yazıda bir counter componenti oluşturup ve bu component ile sayı artırma, sayı azaltma, resetleme ve bir önceki değeri ekranda gösterme işlemlerini yapacağız.


## Angular projesi oluşturma ve paketi yükleme
İlk olarak üzerinde çalışma yapacağımız Angular projemizi oluşturalım ve NgRx için ihtiyacımız olan NPM paketimizi yükleyelim. Terminali açıp aşağıdaki kodları sırası ile çalıştıralım.

```shell
ng new angular-ngrx-usage
``` 
Projemiz oluştuktan sonra proje klasörümüze geçelim.
```shell
cd angular-ngrx-usage
``` 
Şimdide ihtiyacımız olan paketimizi aşağıdaki komut ile yükleyelim.
```shell
npm install @ngrx/store
``` 
Projemizi oluşturduk ve ihtiyacımı olan paketi yüklediğimize göre artık uygulamamızı şekillendirmeye geçebiliriz. Gerekli olan model tanımları ve NgRx için kullanılacak yapının oluşturulmasına başlayabiliriz.

## Model oluşturma
İlk olarak store işlemi için kullanacağımız modeli tanımlayalım. Bunun için projenin ana dizininde **Store** isimli bir klasör açıp içine **Models** isimli başka bir klasör açıp onun içinede **counter.ts** adında dosyamızı oluşturalım. Bu modelimizin içeriğide aşağıdaki gibi olacaktır.
```typescript
export const COUNTER_REDUCER = 'COUNTER_REDUCER';

export interface CounterState {
  current: number;
  previous: number;
}
```
Burada kontrol ettiğimiz işlem counter nesnemizin bir değer artırıp, azalttıkça veya reset işlemi yaptığımızda o andaki değerini görmek için **current** değerini kullanacak olamamız ve her değer değişiminden sonra bir önceki değeride görmek için **previous** değerini kullanacak olmamız.

## Action oluşturma
Store ile yapacağımız action için içinde gerekli tanımlamalarımızı yapalım. Bunun için projenin ana dizininde **Store** isimli klasör içine **Actions** isimli başka bir klasör açıp onun içinede **counter.action.ts** adında dosyamızı oluşturalım. Bu dosyamızın içeriğide aşağıdaki gibi olacaktır.
```typescript
import { createAction } from '@ngrx/store';

export const increment = createAction('[Counter Component] Increment');
export const decrement = createAction('[Counter Component] Decrement');
export const reset = createAction('[Counter Component] Reset');
```
Bu hazırlık ile artık counter nesnemiz için yapacağımız aksiyonları tanımlamış olduk, örneğimizde ihtiyacımız olan sayı artırma(Increment), sayı azaltma(Decrement) ve reset(Reset) işlemi için tek tek bir aksiyon oluşturmuş olduk. Artık bu aksiyonları componentimizin içindeki gerekli methodlarda kullanıp store değerimize hangi aksiyonu yaptığımızı söylemiş olacağız.

## Reducer oluşturma
Store ile yapılan actionları kontrol ettiğimizin ve store içinde yeni state değerlerini oluşturduğumuz reducer dosyamızı oluşturalım. Bunun için projenin ana dizininde **Store** isimli klasör içine **Reducers** isimli başka bir klasör açıp onun içinede **counter.reducer.ts** adında dosyamızı oluşturalım. Bu dosyamızın içeriğide aşağıdaki gibi olacaktır.
```typescript
import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from '../actions/counter.action';
import { CounterState } from '../models/counter';

const initialState: CounterState = {
  current: 0,
  previous: 0,
};

export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => ({
    ...state,
    previous: state.current,
    current: state.current + 1,
  })),
  on(decrement, (state) => ({
    ...state,
    previous: state.current,
    current: state.current - 1,
  })),
  on(reset, () => initialState)
);
```
Oluşan bu reducer sayesinde ise yaptığımız aksiyonların sonucunda neler olacağına ve store içindeki değerimizin nasıl etkileneceğine karar vermiş oluyoruz. Yukarıdaki kodlarda görüldüğü gibi başlangıçta <mark>**initialState**</mark> içinde tanımlı olan değerlerimiz var, ama biz uygulamamız içinde <mark>**increment**</mark> aksiyonunu çağırırsak **current** değerimiz **1** artıyor ve değer artırma işleminden öncede var olan değeri **previous** alanına yazıyoruz. Yine aynı şekilde <mark>**decrement**</mark> aksiyonunu çağırdığımızda ise var olan **current** değerimizi **1** eksiltiyor ve bu işlemden önceki değerimizide yine **previous** alanına yazıyoruz. Son olarak <mark>**reset**</mark> aksiyonunu çağırdığımızda ise her şeyi ilk baştaki **initialState** durumuna alıyoruz.

## Selector oluşturma
Artık store da kullandığımız modelin değerlerini istediğimiz yerden almak için gerekli olan  selector tanımlarımızı yapalım. Bunun için projenin ana dizininde **Store** isimli klasör içine **Selectors** isimli başka bir klasör açıp onun içinede **counter.selector.ts** adında dosyamızı oluşturalım. Bu dosyamızın içeriğide aşağıdaki gibi olacaktır.
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CounterState, COUNTER_REDUCER } from '../models/counter';

export const counterSelector = createFeatureSelector<CounterState>(COUNTER_REDUCER);

export const selectCurrentCount = createSelector(
  counterSelector,
  (state: CounterState) => state.current
);

export const selectPreviousCount = createSelector(
  counterSelector,
  (state: CounterState) => state.previous
);
```
Yukarıdaki tanımlar ile artık store içinde **CounterState** içinde bulunan current ve previous değerlerine erişebiliyoruz. **selectCurrentCount** ile current değerini **selectPreviousCount** ile de previous değerine erişim sağlayabiliyoruz.

## Store configurasyonu yapma
Store kullanımı için gerekli tanımlamayı **app.module.ts** içinde yapmamız gerekiyor ve bunun için **imports** içerisine <mark>**StoreModule.forRoot({ [COUNTER_REDUCER]: counterReducer })**</mark> bilgisini eklememiz gerekiyor. Gerekli tanım yapıldıktan sonra dosya içeriğimiz aşağıdaki gibi olacaktır. **COUNTER_REDUCER** bilgisi bizim için önemli bir tanımlama, selector içinde de bu tanımın kullanıldığını görebilirsiniz. Bu tanım sayesinde store için register işlemi yaparken kullanılacak olan reducer ve selectorların doğru çalışması adına COUNTER_REDUCER değerini kullanıyoruz.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { counterReducer } from './store/reducers/counter.reducer';
import { CounterComponent } from './counter/counter.component';
import { COUNTER_REDUCER } from './store/models/counter';

@NgModule({
  declarations: [AppComponent, CounterComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ [COUNTER_REDUCER]: counterReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Component oluşturma
Store işlemlerini test etmek için bir adet **Counter** isimli component oluşturalım ve basit olarak sayı artırma, azaltma ve resetleme işlemi ile bir önceki sayı bilgisini bize gösteren bir yapıda olması için düzenlememizi yapalım. Componenti oluşturmak için ilk olarak aşağıdaki komut ile projemizin ana dizinine geçelim.
```shell
cd src/app
``` 
Şimdide ihtiyacımız olan componenti oluşturmak için aşağıdaki komutu çalıştırabiliriz.
```shell
ng g c counter
```
Component oluşumu tamamlandıkta sonra görsel düzenleme için template içeriğini aşağıdaki gibi yapalım.
```html
<div class="content">
  <div class="counts">
    <p>Current Count: {{ currentCount$ | async }}</p>
    <p>Previous Count: {{ previousCount$ | async }}</p>
  </div>
  <div class="buttons">
    <button (click)="increment()">Increment ( + )</button>
    <button (click)="decrement()">Decrement ( - )</button>
    <button (click)="reset()">Reset</button>
  </div>
</div>
```
Görsel olarak düzenleme içinde css tanımlarımızıda aşağıdaki gibi yapalım.
```css
.content{
  margin: 0 10%;
}

button {
  width: 200px;
  height: 50px;
  font-size: 20px;
}

p {
  font-size: 42px;
}

.counts {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.buttons{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
```
Son olarak da artık component içeriğine **store** işlemleri için gerekli kodlarımızı yazalım ve bu işlem sonrasında içeriğimiz aşağıdaki gibi olacaktır.
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { decrement, increment, reset } from '../store/actions/counter.action';
import {
  selectCurrentCount,
  selectPreviousCount,
} from '../store/selectors/counter.selector';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent {
  public currentCount$: Observable<number>;
  public previousCount$: Observable<number>;

  constructor(private store: Store) {
    this.currentCount$ = store.select(selectCurrentCount);
    this.previousCount$ = store.select(selectPreviousCount);
  }

  public increment(): void {
    this.store.dispatch(increment());
  }

  public decrement(): void {
    this.store.dispatch(decrement());
  }

  public reset(): void {
    this.store.dispatch(reset());
  }
}
```
Tüm herşey hazır ve çalışır durumda, yukarıdaki kodda görüldüğü gibi daha önce tanımladığımız selector yardımı ile counter nesnemizin mevcut ve önceki değerlerine erişebiliyor, tanımladığımız action vasıtası ile sayı artırma, azaltma ya da reset işlemlerini yapabiliyoruz. **this.currentCount$ = store.select(selectCurrentCount);** satırındaki <mark>**store.select**</mark> methodu ile store içinde tanımlı olan bir değeri seçebiliyoruz ve bu işlem içinde daha önce tanımladığımız selector tanımı olan **selectCurrentCount** bilgisini kullanıyoruz. **this.previousCount$ = store.select(selectPreviousCount);** satırı içinde benzer durum geçerli. <mark>** increment()**</mark> methodu içindeki **this.store.dispatch(increment());** satırı ile de daha önce tanımladığımız action olan <mark>**increment()**</mark> methodunu <mark>**this.store.dispatch**</mark> yardımı ile kullanıyoruz. Bu işlem sonrasında ise store içinde tanımlı olan reducer bizim bu yaptığımız action karşılığı olan işlemi çalıştırıp store içinde gerekli değişikliği yapıyor. Component içinde tanımlı olan diğer methodlarda da bu durum geçerlidir.

Store için gerekli tüm tanımlar ve component  tanımlamalarından sonra proje yapımız resimdeki gibi olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1639056565409/X2SiqDVpZ.png)

Artık sistem kullanmaya hazır olduğuna göre **app.component.html** içinde yeni oluşturduğumuz componentimizi çağıralım ve uygulamamızı çalıştıralım. Ayrıca tek başına counter componenti olmaması için ben bir resim ekledim. Düzenleme sonrası html içeriği aşağıdaki gibi olacaktır.
```html
<div>
  <h1>{{ title }}</h1>
  <img src="../assets/ngrx.png" />
</div>

<app-counter></app-counter>
```
Bu içeriği düzenlemek için aşağıdaki gibi css yazabiliriz.
```css
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 50%;
  }
}
```
Son olarak **app.component.ts** içinde de birkaç düzenleme ile **title** değerimizi oluşturalım ve aşağıdaki gibi görünüme ulaşalım.
```typescript
import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = `Angular ${VERSION.major} NGRX Usage`;
}
```
## Uygulamanın ekran görüntüleri

Uygulama çalıştığında aşağıdaki gibi görünecektir

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1639057365378/0phyABHZW.png)

Sayı artırma işlemi yaptığımızda da değerlerin değişimini görebilirsiniz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1639057410035/L_bRYws3M.png)

## Redux DevTools ile store geçmişini görüntüleme
Son olarak eğer store işlemlerimizin geçmişini görüntülemek ve adım adım neler olduğunu incelemek istersek aşağıdaki komut ile projemize **store-devtools** paketini yükleyip gerekli ayarlamayı yapmamız gerekiyor. Kurulum için gerekli olan komut aşağıdaki gibidir.
```shell
npm install @ngrx/store-devtools --save
```
Bu kurulumu yaptıktan sonra **app.module.ts** içinde düzenleme yapıp <mark>** StoreDevtoolsModule**</mark> tanımını imports alanına eklememiz gerekiyor. Düzenleme sonrası app.module.ts içeriğimiz aşağıdaki gibi olacaktır.
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { counterReducer } from './store/reducers/counter.reducer';
import { CounterComponent } from './counter/counter.component';
import { COUNTER_REDUCER } from './store/models/counter';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent, CounterComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ [COUNTER_REDUCER]: counterReducer }),
    StoreDevtoolsModule.instrument({}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
En basit hali ile **StoreDevtoolsModule.instrument({})** değeri ile tanımlamızı yapmış olduk. Eğer özelleştirme yapmak istersek [buradan](https://ngrx.io/guide/store-devtools/config) ihtiyacımız olan değerleri kullanabiliriz. Projemiz artık store geçmişini görüntülememiz için hazı durumda, son olarak tarayıcı üzerinden de geçmişi görüntülemek için Chrome extension olan **Redux DevTools** kurulumunu yapmamız gerekiyor. Bu extension kurulumundan sonra uygulamamızı çalıştırıp tarayıcıdan geliştiri bölümünü açtığımızda aşağıdaki ekran görüntüsünde olduğu gibi <mark>**Redux**</mark> alanının olduğunu göreceğiz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1639218049095/17avtq_sV.png)
Bu alan açıkken uygulamamızı kullandığımızda yaptığımız her işlem için burada store geçmişini görebileceğiz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1639218171050/PPxSj2I0S.png)
Yukarıdaki ekran görüntüsünde de belirtiğim gibi orta kısımda tüm store geçmişini, sağ bölümde ise seçilen geçmiş kaydının detayını ve en alttaki play butonu ile de tüm store geçmişini izleyebileceğiniz alan bulunuyor. Play butonuna basınca tüm geçmiş adım adım tekrar edilip size sonuçlarını gösteriyor.

## Kaynak kod ve demo adresi
Projenin çalışır haline <mark>[buradan](https://angular-ngrx-usage.netlify.app/)</mark> ve kaynak kodlarınada **GitHub** üzerinden erişebilirsiniz.

[GitHub Repo](https://github.com/sametcelikbicak/angular-ngrx-usage)
