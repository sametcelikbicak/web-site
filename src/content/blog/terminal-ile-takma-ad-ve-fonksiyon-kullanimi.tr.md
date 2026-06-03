---
title: "Terminal ile takma ad ve fonksiyon kullanımı"
date: "2021-11-20"
description: "Terminal kullanımınızı hızlandıracak alias (takma ad) ve fonksiyon tanımlamaları, gizli dosyaları gösterme ve git kısayolları."
tags: ["Terminal", "macOS", "Bash", "Zsh", "Git"]
image: "/blog/terminal_alias_and_function_cover.webp"
---

Merhaba,

Bu yazımda terminal kullanırken işimizi kolaylaştıracak ve bize zaman kazandıracak kolaylıklar olan **alias** ve **function** kullanımından bahsedeceğim. Alias terminalde yazdığımız komutlara kolay ve daha akılda kalıcı kısaltmalar yani takma adlar vermemize yardımcı olur. Fonksiyonlar ise yazdığımız komutlarda parametre kullanmamız gerektiği durumlarda ya da birden fazla komut ile işlem yaptığımızda işimize yarar.

Bu örnekler için benim işime yarayan ve hızlıca sonuç aldığım **macOS** ortamında hızlıca gizli dosyaları ve klasörüleri gösterip veya gizlememe yaran komutları çalıştırdığım bir fonksiyonu ve **git** işlemleri için yazdım komutları kısaltmama yarayan takma adları göstereceğim.

Komutlarımızı aktif edebilmek için ilk olarak sistemimizde kullandığımız **bash** veya **zsh** için gerekli olan config dosyasını açıp içerisinde tanımlamalarımızı yapmamız gerekiyor. Bu işlem için terminalde aşağıdaki komutu çalıştırıp ilgili config dosyasına erişebilirsiniz. Benim aktif kullandığım **zsh** olduğu için aşağıdaki komutu kullanıyorum.

```shell
code .zshrc
``` 
Bu komut sonrasında config dosyamız VSCode ile açılacak ve bizim gerekli düzenlemeleri yapmamız için hazır durumda olacaktır. Açılan config dosyamızın en sonuna aşağıdaki gibi komutlarımızı ekleyebiliriz.

```shell
# Functions
showAll() {
  if [ -z "$1" ];
  then
    echo "Function needs an argument true/false to show/hide hidden file(s) and folder(s)"
    echo "I.E: showAll true --> show hidden file(s) and folder(s)"
    echo "I.E: showAll false --> hide hidden file(s) and folder(s)"
  else
    defaults write com.apple.finder AppleShowAllFiles -boolean "$1";killall Finder
    if [ "$1" = true ];
    then
      echo "Hiden file(s) and folder(s) were shown"
    else
      echo "Hiden file(s) and folder(s) were hidden"
    fi  
  fi
}


# Aliases
alias gs='git status'
alias ga.='git add .'
alias gc='git commit'
alias gl='git log'

alias ~='cd ~'
alias .='cd ..'
alias ..='cd ../..'
``` 
Bu komutları ekledikten sonra terminalimiz açıksa bir kere kapatmamız gerekiyor ve ilk açılışta config dosyasında komutları tanıyabilmesi için. Terminalimizi yeniden açtığımızda artık config dosyasında tanımladığımız alias ve function bilgilerini rahatlıkla kullanabilir duruma gelmiş oluyoruz. Şimdi sıra geldi bu komutları kullanmaya. Test için hem normal hemde gizli olan bir klasör ve dosya oluşturalım ve burada hem gizli dosyalarını gösterip gizleme işlemini hemde git işlemlerimizi yapalım. Sırasıyla aşağıdaki komutlar ile ortamımızı oluşturalım.

**Test** isimli bir klasör oluşturalım
```shell
mkdir Test
``` 
Oluşturduğumuz Test isimli klasör içerisine konumlanalım.
```shell
cd Test
```
Burada git init işlemini yapalım. 
```shell
git init
``` 
**Normal** isimli bir klasör oluşturalım.
```shell
mkdir Normal
``` 
**normal.txt** isimli bir dosya oluşturalım.
```shell
touch normal.txt
``` 
**Hidden** isimli bir klasör oluşturalım.
```shell
mkdir Hidden
```
**hidden.txt** isimli bir dosya oluşturalım. 
```shell
touch hidden.txt
```
Hidden klasörümüzü **gizli** durumuna alalım. 
```shell
chflags hidden Hidden
```
hidden.txt dosyamızı **gizli** durumuna alalım. 
```shell
chflags hidden hidden.txt
``` 
Tüm bu komutlar çalıştıktan sonra terminalimizde aşağıdaki gibi bir görüntü olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637407401397/2IVpHU4Km.png)
Daha sonra Finder a oluşturduğumuz **Test** klasörünü açıp baktığımızda aşağıdaki gibi sadece Normal klasörü ve normal.txt dosyasının olduğunu diğerlerinin görünmediğini görebilirsiniz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637407524339/emJrFwBuA.png)
Şimdi geldik artık yazdığımız fonksiyon ve takma adların çalışıp çalışmadığını test etmeye. İlk olarak **showAll** fonksiyonunu test edelim. Yukarıdaki kodlarda göreceğiniz gibi fonksiyon içerisinde **$1** şeklinde kullanılan bir parametre bilgisi var, biz terminalde ilgili fonksiyonu çağırdığımızda parametre olarak **true** veya **false** bilgisini vereceğiniz ve kodumuzun içinde **$1** ile kullanılan alanda komut bizim için gerekli işlemi yapacak.

```shell
showAll true
``` 
Komut çalıştırdıktan sonra ekran görüntüsünde belli olduğu gibi artık gizli dosya ve klasörler bizim için görünür duruma geldi ve fonksiyon içinde yazdığımız bilgilendirme mesajıda terminalde komutumuzdan sonra göründü.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637407919815/chwypt0Lo.png)
Şimdi aynı komutu görünen gizli dosyalarımı saklamak için kullanalım ve sonucuna bakalım.

```shell
showAll false
```

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637408033253/eedo5yIs6.png)
Eğer showAll fonksiyonunu çağırırken parametre kullanmazsak bize yine fonksiyon içinde yazdığımız uyarı mesajını verecektir.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637408159308/Wfqg_pVeQ.png)

Fonksiyon kullanımızı anladığımıza göre şimdi git ve ayrıca dizin değiştirmek için hazırladığımız takma ad kullanım örneklerine geçebiliriz. İlk olarak **gs** komutu ile başlayalım ve bu komut bizim için **git status** komutunu çalıştırıp sonucunu gösterecektir.

```shell
gs
``` 

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637408342853/MRWGvRIZn.png)
Yaptığımız değişiklikleri commit etmeden önce stage ortamına almak için **ga.** komutunu kullanalım ve config içinde göreceğiniz gibi bu bize **git add .** komutunu çalıştıracak ve dosyalarımızı stage ortamına alacak, hemen sonrasında yeniden **gs** komutu ile değişimi görebiliriz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637408476191/mvUoyYLr8.png)
Yaptığımız değişiklikler artık commit yapmaya hazır ve şimdide bu işlem için hazırladığımız **gc** takma adını kullanalım. Ben commit işlemlerinde mesaj kısmı için Vim kullandığımdan git commit -m"Commit mesajı" kullanımı yerine **git commit** kullanılıyorum ve açılan Vim ekranından commit mesajımı giriyorum. **gc** takma adını çalıştırdığımızda bizim için **git commit** komutu çalışacak ve commit mesajı için Vim ekranı açılacak, mesajımızı girdikten sonra Vim ekranından **:wq** komutları ile çıkış yapıp yeniden terminal ekranımıza döneceğiz.

```shell
gc
``` 
Komut çalışıp commit mesajımızı girdikten sonra terminal ekranımız aşağıdaki gibi görünüyor.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637408810601/nQ5jMEHzZ.png)
Git işlemleri için son olarakta yaptığımız commitlerin kayıtlarına bakalım ve bu işlem için hazırladığımız **gl** takma adını kullanalım.

```shell
gl
```
**gl** takma ad kullanımı bizim için **git log** komutunu çalıştırdı ve sonucunu aşağıda görebiliriz.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637408968818/G808pwCA-.png)
Tüm bunlara ilave olarak birde konum değiştirmeyi kolaylaştırmak için hazırladığım takma adlara bakalım ve bir örnek yapalım. Yukarıdaki config tanımlarında göreceğiniz gibi **.** ile bir üst konuma ya da **~** ile kök konuda gidebilirsiniz. Hemen denemesini yapalım ve sonuçlarına bakalım.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637409336984/zZm-Jkli7.png)
Görüldüğü gibi bu şekilde kısa takma ad(Alias) ya da fonksiyon(Function) tanımları ile işlerimizi kolaylaştırıp zaman kazanabiliriz. Benim hazırladığım örnekler haricinde sizde kendi ihtiyaçlarınıza göre gerekli alias veya function tanımlarını yapabilirsiniz.
