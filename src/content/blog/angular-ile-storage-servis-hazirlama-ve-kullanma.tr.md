---
title: "Angular ile Storage Servis hazırlama ve kullanma"
date: "2021-06-20"
description: "Angular ile Storage Servis hazırlama ve kullanma"
tags: ["Angular", "Storage", "Service", "Frontend"]
image: "/blog/angular_storage_service_cover.webp"
---

Merhaba,

Bu yazımda Angular ile storage işlemlerinde kullanacağımız bir Storage Service hazırlama ve kullanımına bakacağız. İlk olarak var olan Angular projemize yeni bir servis ekleyelim ve sonrasında kullanımına göz atalım. Bu servis ile hem **LocalStorage** hem de **SessionStorage** üzerinde veri ekleme silme ve kayıtlı veriyi alma işlemlerini yapabileceğiz. Ayrıca yardımcı methodlar sayesinde de tek seferde session storage, local storage ya da ikisinden de aynı aynda tüm verilerimizi temizleme işleminide yapabileceğiz.

Aşağıdaki gibi servisimizi ekleyelim.


```
// storage.service.ts

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Store value to Local storage
   *
   * @param key - Stored value key
   * @param value - Stored value
   * @returns void
   */
  public addToLocalStorage(key: string, value: any): void {
    this.addToStorage(localStorage, key, value);
  }

  /**
   * Store value to Session storage
   *
   * @param key - Stored value key
   * @param value - Stored value
   * @returns void
   */
  public addToSessionStorage(key: string, value: any): void {
    this.addToStorage(sessionStorage, key, value);
  }

  /**
   * Get value from Local storage
   *
   * @param key - Stored value key
   * @returns Stored value
   */
  public getFromLocalStorage(key: string): any {
    return this.getFromStorage(localStorage, key);
  }

  /**
   * Get value from Session storage
   *
   * @param key - Stored value key
   * @returns Stored value
   */
  public getFromSessionStorage(key: string): any {
    return this.getFromStorage(sessionStorage, key);
  }

  /**
   * Remove value from Local storage
   *
   * @param key - Stored value key
   * @returns void
   */
  public removeFromLocalStorage(key: string): void {
    this.removeFromStorage(localStorage, key);
  }

  /**
   * Remove value from Session storage
   *
   * @param key - Stored value key
   * @returns void
   */
  public removeFromSessionStorage(key: string): void {
    this.removeFromStorage(sessionStorage, key);
  }

  /**
   * Remove all values from Local storage
   *
   * @returns void
   */
  public clearLocalStorage(): void {
    localStorage.clear();
  }

  /**
   * Remove all values from Session storage
   *
   * @returns void
   */
  public clearSessionStorage(): void {
    sessionStorage.clear();
  }

  /**
   * Remove all values from Local and Session storage
   *
   * @returns void
   */
  public clearStorage(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  private addToStorage(storage: Storage, key: string, value: any): void {
    this.checkStorageKey(key);
    storage.setItem(key, JSON.stringify(value));
  }

  private getFromStorage(storage: Storage, key: string): any {
    this.checkStorageKey(key);
    const item = storage.getItem(key);

    if (item && item !== 'undefined') {
      return JSON.parse(item);
    }

    return null;
  }

  private removeFromStorage(storage: Storage, key: string): void {
    this.checkStorageKey(key);
    storage.removeItem(key);
  }

  private checkStorageKey(key: string): void {
    if (key == null || key === '') {
      throw new ReferenceError('storage key must not be null or empty');
    }
  }
}

``` 
Servisimizi ekledikten sonra şimdide bu servis methodlarımızı kontrol edeceğimiz butonları sayfamıza ekleyelim.


```
<!-- app.component.html -->

<h1>{{ title }}</h1>

<div class="buttons">
  <button (click)="addToLocalStorage()">Add to Local Storage</button>
  <button (click)="getFromLocalStorage()">Get from Local Storage</button>
  <button (click)="removeFromLocalStorage()">Remove from Local Storage</button>
  <button (click)="addToSessionStorage()">Add to Session Storage</button>
  <button (click)="getFromSessionStorage()">Get from Session Storage</button>
  <button (click)="removeFromSessionStorage()">Remove Session Storage</button>
  <button (click)="clearLocalStorage()">Clear Local Storage</button>
  <button (click)="clearSessionStorage()">Clear Session Storage</button>
  <button (click)="clearStorage()">Clear Storage</button>
</div>

<div class="margin-top">
  <label>{{label}}</label>
  <p>{{result}}</p>
</div>
``` 

Şimdide tek tek butonların işlevlerine ve servisimizin kullanımına bakalım. İlk olarak local storage üzerinde yapacağımız işlemlere bakalım. Yapabileceğimiz işlemler storage üzerine veri eklemek, eklediğimiz veriyi silmek ya da storage üzerinden eklenen tüm verileri temizlemek.

* **addToLocalStorage** methodu ile verdiğimiz key ve value değerlerini içeren yeni bir kaydı local storage üzerine ekliyoruz.
* **getFromLocalStorage** methodu yardımı ile de verilen key değerine ait value içeriğine erişebiliyoruz.
* **removeFromLocalStorage** methodu ile de verilen key değerini local storage üzerinden siliyoruz.
* **clearLocalStorage** methodu vasıtasıyla da local storage üzerinde kayıtlı tüm değerleri silebiliyoruz.

Aynı işlemleri session storage için de yapmak için aşağıdaki methodları kullanabiliriz.

* **addToSessionStorage** methodu ile verdiğimiz key ve value değerlerini içeren yeni bir kaydı session storage üzerine ekliyoruz.
* **getFromSessionStorage** methodu ile de verilen key değerine ait value içeriğine erişebiliyoruz.
* **removeFromSessionStorage** methodu ile de verilen key değerini session storage üzerinden siliyoruz.
* **clearSessionStorage** methodu ile session storage üzerinde kayıtlı tüm değerleri silebiliyoruz.

Bu işlemler yanında da;
* **clearStorage** methodu ile hem local hemde session storage üzerindeki tüm değerleri silebiliyoruz.

Method açıklamalarını hazırladığımıza göre şimdi de onların implementasyon kısmına bakalım ve app.component içeriğimizi aşağıdaki gibi ayarlayalım.


```
// app.component.ts

import { Component, VERSION } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = `Angular ${VERSION.major} Storage Servis Kullanımı`;
  private key = 'StorageKey';
  private value = 'StorageValue';
  public label: string;
  public result: string;

  constructor(private storageService: StorageService) {}

  public addToLocalStorage(): void {
    this.storageService.addToLocalStorage(this.key, this.value);
  }

  public addToSessionStorage(): void {
    this.storageService.addToSessionStorage(this.key, this.value);
  }

  public getFromLocalStorage(): any {
    this.label = 'Get from Local Storage';
    this.result = this.storageService.getFromLocalStorage(this.key);
  }

  public getFromSessionStorage(): any {
    this.label = 'Get from Session Storage';
    this.result = this.storageService.getFromSessionStorage(this.key);
  }

  public removeFromLocalStorage(): void {
    this.storageService.removeFromLocalStorage(this.key);
  }

  public removeFromSessionStorage(): void {
    this.storageService.removeFromSessionStorage(this.key);
  }

  public clearLocalStorage(): void {
    this.storageService.clearLocalStorage();
  }

  public clearSessionStorage(): void {
    this.storageService.clearSessionStorage();
  }

  public clearStorage(): void {
    this.storageService.clearStorage();
  }
}
``` 
Şimdide örnek olması için hızlıca uygulama üzerindeki **"Add to Local Storage"** ve **"Add to Session Storage"** butonları ile storage üzerine attığımız değerleri görelim.


![Local storage](https://cdn.hashnode.com/res/hashnode/image/upload/v1624875627303/QeC7d4Ruo.png)


![Session storage](https://cdn.hashnode.com/res/hashnode/image/upload/v1624875609842/FxclhqIog.png)

Proje ait **StackBlitz** ve **GitHub** linklerine aşağıdan erişebilirsiniz.


%[https://stackblitz.com/edit/angular-storage-service?embed=1&file=src/app/app.component.html]


%[https://github.com/sametcelikbicak/angular-storage-service]




