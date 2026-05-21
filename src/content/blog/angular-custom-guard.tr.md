---
title: "Angular Custom Guard"
date: "2022-04-10"
description: "Angular uygulamalarında sayfa geçişlerini kontrol eden Guard yapısının (CanActivate ve CanDeactivate) nasıl kurulacağını ve login/profile senaryosu üzerinden kullanımını anlatıyorum."
tags: ["Angular", "Guard", "Security", "Frontend"]
image: "/blog/angular_guard_cover.webp"
---

Merhaba,

Bu yazımda size Angular **Guard** yapısından ve kullanımından bahsedeceğim. Guard yapısı ile uygulamamızda yapmış olduğumuz sayfalar arası geçişlerimize kontrol mekanizması eklemiş oluyoruz. Hangi kullanıcı bu sayfaya erişebilecek, hangi aşamada sayfadan ayrılabilecek vb. Örneğin sisteme giriş yapan bir kullanıcı tüm sayfalara erişebilirken, giriş yapmayan kullanıcı sadece belirli sayfalarını görebiliyor.

Bu konumuz için Home, Profile sayfaları olan ve bir de Login, Logout yapısı olan bir uygulama hazırlayalım ve profile sayfasına sadece login olan kullanıcı erişebilsin ve ayrıca profile sayfasındayken değişiklikleri kayıt etmeden sayfadan ayrılamasın.

### Uygulama Klasör Yapısı
```
src
├── app
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   ├── components
│   │   ├── login
│   │   └── profile
│   ├── guards
│   │   ├── can-activate.guard.ts
│   │   └── can-deactivate-profile.guard.ts
│   └── services
│       ├── auth.service.ts
│       └── data.service.ts
```

### Proje ve Servislerin Oluşturulması
İlk olarak projemizi ve gerekli servislerimizi oluşturalım:

```bash
ng new angular-guard-usage
cd angular-guard-usage
ng g s services/auth
ng g s services/data
```

### Guard ve Componentlerin Oluşturulması
Kontrol için kullanacağımız active ve deactive guard servislerini ve sayfalarımızı oluşturalım:

```bash
ng g guard guards/can-activate
ng g guard guards/can-deactivate-profile
ng g c components/login
ng g c components/profile
```

### Yönlendirme Yapılandırması
`app-routing.module.ts` içerisinde guard'larımızı ilgili route tanımlarına ekliyoruz:

```typescript
const routes: Routes = [
  { component: LoginComponent, path: 'login' },
  {
    component: ProfileComponent,
    path: 'profile',
    canActivate: [CanActivateGuard],
    canDeactivate: [CanDeactivateProfileGuard],
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
```

### Guard İçerikleri

#### CanActivate Guard
Bu guard, kullanıcının sisteme giriş yapıp yapmadığını kontrol eder:

```typescript
@Injectable({ providedIn: 'root' })
export class CanActivateGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  public canActivate(): boolean {
    if (!this.authService.isLoggedIn) {
      alert('You should login first...');
      return false;
    }
    return true;
  }
}
```

#### CanDeactivate Guard
Bu guard, kullanıcının sayfadan ayrılmadan önce değişiklikleri kaydedip kaydetmediğini kontrol eder:

```typescript
@Injectable({ providedIn: 'root' })
export class CanDeactivateProfileGuard implements CanDeactivate<ProfileComponent> {
  constructor(private dataService: DataService) {}

  public canDeactivate(component: ProfileComponent): boolean {
    if (!this.dataService.isSaved || !component.isSaved) {
      alert('You should save your changes...');
      return false;
    }
    return true;
  }
}
```

### Servis Mantığı

#### Auth Service
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn: boolean = false;
  public get isLoggedIn(): boolean { return this._isLoggedIn; }
  public login(): void { this._isLoggedIn = true; }
  public logout(): void { this._isLoggedIn = false; }
}
```

#### Data Service
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private _isSavedChanges: boolean = false;
  public get isSaved(): boolean { return this._isSavedChanges; }
  public saveChanges(): void { this._isSavedChanges = true; }
  public rollbackChanges(): void { this._isSavedChanges = false; }
}
```

### Özet
Bu örnekte bir sayfaya erişimi (`canActivate`) ve sayfadan ayrılmayı (`canDeactivate`) nasıl kontrol edeceğimizi öğrendik. Guard yapısı, Angular uygulamalarında güvenlik ve veri tutarlılığı sağlamak için kritik bir rol oynar.

### Kaynak Kod ve Demo
Örnek projenin kaynak kodlarına ve çalışan demosuna aşağıdan ulaşabilirsiniz:

- [GitHub Repo: Angular Guard Usage](https://github.com/sametcelikbicak/angular-guard-usage)
- [Canlı Demo](https://angular-guard-usage.netlify.app/)
