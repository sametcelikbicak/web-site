---
title: "macOS Dock İçin Ayraç Ekleme"
date: "2022-05-29"
description: "macOS Dock üzerinde uygulamaları ve dokümanları daha iyi organize etmek için nasıl özel ayraçlar (spacer) ekleyebileceğinizi anlatıyorum."
tags: ["macOS", "Dock", "Customization", "Tutorial"]
image: "/blog/macos_dock_cover.webp"
---

Merhaba,

Bu yazımda macOS için kullandığımız Dock üzerinde istediğimiz gruplamayı yapabilmek için ayraç ekleme işleminden bahsedeceğim. Normal olarak dock iki bölümden oluşuyor: uygulamalarımızın olduğu bölüm ve dokümanların olduğu bölüm. Bu bölümler dışında kendimiz özelleştirme yapabilmemiz için aşağıdaki komutları kullanıp istediğimiz kadar ayraç ekleyebiliriz. Özel ayraç eklemeden önce dock aşağıdaki gibi görünüyor:

![macos-dock-initial](https://cdn.hashnode.com/res/hashnode/image/upload/v1653835840938/Z7i1cwbyE.png)

### Uygulama bölümüne ayraç ekleme
Uygulamalarımızın olduğu bölüme ayraç eklemek için terminalde aşağıdaki komutları sırası ile çalıştırmamız yeterlidir. İlk olarak aşağıdaki komutu çalıştıralım:

```shell
defaults write com.apple.dock persistent-apps -array-add '{tile-type="spacer-tile";}'
``` 

Bu komut çalıştıktan sonra Dock'u yeniden başlatmak için terminalde aşağıdaki komutu çalıştıralım ve ayracımızın eklendiğini görelim:

```shell
killall Dock
``` 

Bu işlem sonrasında ayracımız eklenmiş olacak ve Dock aşağıdaki gibi görünecektir:

![macos-dock-spacer-added](https://cdn.hashnode.com/res/hashnode/image/upload/v1653836164820/1AYmFwH0W.png)

Ayracımız eklendikten sonra klavyeden <kbd>⌥ Option</kbd> tuşuna basılı tutarak ayracımıza tıklayıp istediğimiz noktaya sürükle-bırak ile Dock üzerinde özelleştirme yapabiliriz. Alttaki resimde olduğu gibi az önce eklediğimiz ayracı anlattığım gibi sürükleyip yeni bir noktaya taşıdım:

![macos-dock-spacer-moved](https://cdn.hashnode.com/res/hashnode/image/upload/v1653836410479/m-JmWKlCu.png)

Birden fazla ayraç ekleyip istediğimiz gibi özelleştirme yapabiliriz:

![macos-dock-multiple-spacers](https://cdn.hashnode.com/res/hashnode/image/upload/v1653836499850/jurMK76MA.png)

### Doküman bölümüne ayraç ekleme
Bu bölüme ayraç eklemek için terminalde aşağıdaki komutları sırası ile çalıştırmamız yeterlidir. İlk olarak aşağıdaki komutu çalıştıralım:

```shell
defaults write com.apple.dock persistent-others -array-add '{tile-data={}; tile-type="spacer-tile";}'
``` 

Bu komut çalıştıktan sonra Dock'u yeniden başlatmak için terminalde aşağıdaki komutu çalıştıralım ve ayracımızın eklendiğini görelim:

```shell
killall Dock
``` 

Bu işlem sonrasında ayracımız eklenmiş olacak ve Dock aşağıdaki gibi görünecektir:

![macos-dock-doc-spacer](https://cdn.hashnode.com/res/hashnode/image/upload/v1653837058594/dX02TtfGJ.png)

Artık hem uygulama hem de doküman bölümü için yukarıdaki kodları istediğimiz kadar çalıştırıp kendimize göre Dock özelleştirmemizi yapabiliriz.
