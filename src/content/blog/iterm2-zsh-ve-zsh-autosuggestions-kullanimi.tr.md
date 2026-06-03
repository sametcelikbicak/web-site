---
title: "iTerm2, zsh ve zsh-autosuggestions kullanımı"
date: "2021-05-15"
description: "iTerm2, zsh ve zsh-autosuggestions kullanımı"
tags: ["Terminal", "macOS", "zsh", "iTerm2"]
image: "/blog/iterm2_zsh_cover.webp"
---

Merhaba,

Bu yazımda size **iTerm2** terminalini ve bu termial ile birlikte kullandığım **zsh** shell ve **zsh-autosuggestions** yardımcısından bahsedeceğim. İlk olarak iTerm2 bir terminal ve MacOs ile birlikte genel terminalden daha fazla esnekliğe sahip ve bu terminal ile birlikte bahsettiğim zsh ve zsh-autosuggestions yardımcısını kullanarak hızlıca istediğimizi yapabilir duruma geliyor. Özellikle bazı komutları hatırlamak ya da uzun uzun yazmak yerine zsh-autosuggestions yardımı ile birkaç harf yazdıktan sonra geri kalanını otomatik olarak tamamlayabiliyoruz.

İlk olarak  [iTerm2](https://iterm2.com/)  kurulumuzu yapalım. Kurulum işleminden sonra da MacOs için olan paket yöneticisi **Homebrew** kurulumunu aşağıdaki komut ile yapalım.

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
``` 
Homebrew kurulumundan sonra da sırası ile zsh kurulumunu yapalım.
```
brew install zsh
``` 
Şimdiden tema ve birçok fonksiyon desteği içinde  [oh-my-zsh](https://ohmyz.sh/) kurulumunu yapalım.

```
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
``` 
Kurulum bittikten sonra artık terminalimizi kullanmaya başlayabiliriz.

![Screen Shot 2021-05-15 at 16.46.55.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1621086424671/XlqbDgEBS.png)
Şimdide terminalde bize yardımcı olan zsh-autosuggestions ayarlamasını yapalım.  [Install](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md) sayfasında belirttiği gibi sistemimizdeki **.zshrc** dosyasını açıp içine aşağıdaki komutu eklemeliyiz. Ben bu işlem için terminal üzerinden **vim** yardımı ile bu adımı tamamladın sizde sizin için uygun olan bir yöntem ile ilgili config dosyasını açıp düzenlemeyi yapabilirsiniz.

```
 vim .zshrc
``` 
Komutu yardımı ile config dosyamızı açıp en altına aşağıdaki komutu ekliyoruz.

```
source /usr/local/share/zsh-autosuggestions/zsh-autosuggestions.zsh
``` 
Bu işlemden sonra terminali kapatıp yeniden açtığımızda artık zsh-autosuggestions yardımcımız bizim yazdığımız komutları dinleyip bize önerilerde bulunmaya başlıyor. Aşağıdaki ekran görüntüsünde de belli olduğu gibi daha önce çalıştırdığım **git commit --allow-empty** komutu için ben yazmaya başlağımda satırın devamında açık bir renkle öneri olan komutu gösteriyor ve biz klavyeden sağ ok(  <kbd>></kbd> ) yardımı ile komutu otomatik olarak tamamlayabiliyoruz.

![Screen Shot 2021-05-15 at 16.53.24.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1621086815389/olmO33lIM.png)

Bu şekilde bir yardımcı kullanımı ile umarım işlerinizi bir nebze olsun kolaylaştırabilirsiniz.

