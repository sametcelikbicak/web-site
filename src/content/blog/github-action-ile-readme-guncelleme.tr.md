---
title: "GitHub Action ile README güncelleme"
date: "2021-04-10"
description: "GitHub Action ile README güncelleme"
tags: ["GitHub Action", "README", "Tools"]
image: "/blog/github_action_readme_cover.webp"
---

Merhaba

Bu yazımda **GitHub** üzerindeki herhangi bir repo içinde olan **README** dosyamızı **GitHub Actions** yardımı ile nasıl güncelleyebileceğimize bakacağız. Bu işlem için ister var olan bir proje için actions ekleyip düzenleme yapabilir ya da yeni bir repo oluşturup bu düzenlemeyi yapabiliriz.

Bu konu dahilinde ben sadece GitHub Actions özelinde olmasını istediğim için yeni bir repo oluşturup onun içerisine gerekli eklemeleri yaparak örneğimizi hazırlayacağım. İlk olarak GitHub üzerinde **github-actions-readme-update** isimli bir repo oluşturalım ve bu repo içine README dosyamızıda ekleyelim.


![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1618066001449/-TcqHnfvw.png)

Repomuzu oluşturduktan sonra ilk görünüm aşağıdaki gibi olacaktır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1618066150970/_LN9T484z.png)

Repomuz hazır olduğuna göre şimdi sırada Actions kısmını eklemekte. Bu işlem için repomuzun ana dizininde **.github/workflows** şeklinde klasörümü oluşturuyoruz ve bu klasör içine de istediğimiz bir ismi vereceğimiz **yml** uzantılı konfigürasyon dosyamızı ekliyoruz. Ben bu işlem için **blog-posts.yml** isimli bir dosya oluşturdum. Oluşturduğum bu blog-posts.yml dosyasının içeriğinide aşağıdaki gibi ayarladım.


```
name: Latest blog posts
on:
  schedule: # Run workflow automatically
    - cron: '0 * * * *' # Runs every hour, on the hour
  workflow_dispatch: # Run workflow manually (without waiting for the cron to be called), through the Github Actions Workflow page directly
jobs:
  update-readme-with-latest-blog-posts:
    name: Update this repo's README with the latest blog posts
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: gautamkrishnar/blog-post-workflow@master
        with:
          feed_list: "https://sametcelikbicak.com/rss.xml"
``` 
Eklediğimiz bu yml dosyası içindeki **cron: **  satırındaki tanımlarım bu actions dosyasının her saat çalışacağını belirtiyor ve **feed_list:** satırında ise güncellenecek olan içeriğin nereden alınacağını belirtiyor.

Bu tanımları yaptıktan sonra şimdide sıra **README** dosyamızın içeriği düzenlemekte. Aşağıdaki gibi bir düzenleme ile actions çalıştığında README içinde ilgili alanda action sonucu oluşan kayıtları görebileceğiz. README dosyamızın içeriğine aşağıdaki tanımı ekleyip kayıt edelim.

```
### 📋 Latest Blog Posts 📋

<!-- BLOG-POST-LIST:START -->

<!-- BLOG-POST-LIST:END -->
``` 

Değişikliklerden 📋 Latest Blog Posts 📋 kısmı eklenen içerik için başlık olarak kullanılacaktır. **BLOG-POST-LIST:START** ve **BLOG-POST-LIST:END** tanımları arasına da actions sonucu oluşan kayıtlarımız gelecektir. Gerekli eklemeleri yaptıktan sonra README dosyamız ilk olarak aşağıdaki gibi görünecektir.


![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1618066911430/4paebw2o2.png)

Bu düzenlemeden bir saat sonra veya repo sayfamızdaki **Actions** bölümüne gidip elle tanımladığımız actions ı çalıştırdıktan sonra ise README dosyamızın güncellendiğini görebiliriz. Biz ilk olarak elle actions ı çalıştıralım ve sonucumuza bakalım.


![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1618067037150/HWZExah2Z.png)

Actions sayfasında işaretli alandan elle çalıştırma işlemini yapalım. Çalıştırma işlemi sonrası tanımladığımız action başarılı olarak sonuçlanmıştır.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1618067368442/76tkwdU6hp.png)

İşaretli alanı tıklayıp çalışan görevimizin detaylarına da bakabilirsiniz. Bu görev çalıştıktan sonra şimdi README sayfamızı bir kontrol edelim.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1618067746699/NC94eDu4Y.png)

Gördüğünüz gibi artık README dosyamız güncellenmiş. Sizde bu repoya bakarak kendiniz için istediğiniz gibi düzenleme yapıp GitHub Actions yardımı ile herhangi bir projenize veya profil sayfanıza ait repo için bu yapıyı kullanabilirsiniz. Projeye ait **GitHub** reposuna aşağıdan ulaşabilirsiniz.


%[https://github.com/sametcelikbicak/github-actions-readme-update]

