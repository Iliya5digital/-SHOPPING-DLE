<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="icon" href="{THEME}/images/favicon.ico" type="image/x-icon">
<link rel="shortcut icon" href="{THEME}/images/favicon.ico" type="image/x-icon">
{headers}
<link type="text/css" rel="stylesheet" href="{THEME}/css/style.css" />
<link rel="stylesheet" href="{THEME}/css/engine.css">
<link rel="stylesheet" href="{THEME}/css/loader.min.css">
<link href="https://fonts.googleapis.com/css?family=Rubik:400,500,700&display=swap&subset=cyrillic" rel="stylesheet">
<link rel="stylesheet" href="{THEME}/css/tools.min.css">
<link rel="stylesheet" href="{THEME}/css/theme.min.css">
<link  href="https://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.css" rel="stylesheet">
</head>

<body id="body">

<div id="loader"><div class="loader-body"><div class="pre-loader">
<div class="square"></div>
<div class="square"></div>
<div class="square last"></div>
<div class="square clear"></div>
<div class="square"></div>
<div class="square last"></div>
<div class="square clear"></div>
<div class="square"></div>
<div class="square last"></div>
</div></div></div>
    
<div id="wrapper">
    
{include file="modules/header.tpl"}
    
[not-available=main]
<section class="path">{speedbar}</section>

<section class="middle section">
<div class="cnt clr">
    
<div id="content">
[available=tags]<h1 class="title-1">Товары по тэгу: {cloudstag}</h1>[/available]
[available=favorites]<h1 class="shop-page-title">Мои закладки</h1>[/available]
[available=cat]<h1 class="shop-page-title">{category-title}</h1><p class="shop-page-descr">{category-description}</p>
<div class="goods-settings clr">
<div class="goods-view-mode">
<span class="goods-view-mode-grid" title="Вид отображения: сетка"></span>
<span class="goods-view-mode-list" title="Вид отображения: список"></span>
</div>
<div class="goods-sorter"><span class="slist">Сортировка: {sort}</span></div>
</div>
[/available]
[available=cat|favorites|tags]<div id="goods-cont" class=""><div id="goods_cont"><div class="goods-list with-clear" id="dle-content">[/available]
{content}{info}
[available=cat|favorites|tags]</div></div></div>[/available]
</div>
    
{include file="modules/sidebar.tpl"}
    
</div></section>
[/not-available]
    
[available=main]
    
{include file="modules/block1.tpl"}
{include file="modules/block2.tpl"}
      
<section class="section goods-carousel-section">
<div class="cnt clr">
<h2 class="title-1">Хиты продаж</h2>
<div class="gcarouselwrap">
<span class="gcarouselarrow prev"><i class="las la-angle-left"></i></span>
<span class="gcarouselarrow next"><i class="las la-angle-right"></i></span>
<div class="gcarouselbody">
<div class="gcarousel">
<div class="goods-list with-clear">
{custom category="9" template="modules/custom1" aviable="global" from="0" limit="10" order="date"}
</div></div></div></div></div>
</section>
    
<section class="section banner-section">
<div class="cnt clr">
<div class="col2">
<div class="banner">
<img src="{THEME}/images/banner-3.jpg" alt="img">
<div class="banner-text">
<div class="banner-text-1">Ультрабуки <span>-20%</span></div>
<div class="banner-text-2">Следует отметить, что консультация с широким активом своего покупателя</div>
<a href="#" class="button big color2">Смотреть<i class="las la-arrow-right"></i></a>
</div></div></div>
<div class="col2">
<div class="banner">
<img src="{THEME}/images/banner-4.jpg" alt="img">
<div class="banner-text">
<div class="banner-text-1">Наушники <span>-35%</span></div>
<div class="banner-text-2">Следует отметить, что консультация с широким активом своего покупателя</div>
<a href="#" class="button big color2">Смотреть<i class="las la-arrow-right"></i></a>
</div></div></div>
</div>
</section>
    
<section class="section">
<div class="cnt clr">
<h2 class="title-1">Стоит посмотреть</h2>
<div class="tabs popular-goods">
<div class="tabs-head"><span>Ноутбуки</span><span>Смартфоны</span><span>Аудио</span></div>
<ul class="tabs-body">
<li>
{custom category="9" template="modules/custom2" aviable="global" from="0" limit="6" order="date"}
</li>
<li>
{custom category="9" template="modules/custom2" aviable="global" from="0" limit="6" order="date"}
</li>
<li>
{custom category="9" template="modules/custom2" aviable="global" from="0" limit="6" order="date"}
</li>
</ul>
</div></div>
</section>
    
<section class="section">
<div class="cnt clr">
<div class="banner big-banner">
<img src="{THEME}/images/banner-5.jpg" alt="img">
<div class="big-banner-text">
<div class="big-banner-text-1">Улетные скидки от Apple</div>
<div class="big-banner-text-2">Девайсы от 32990 ₽</div>
<div class="big-banner-text-3">Значимость этих проблем настолько очевидна, что постоянное информационно-пропагандистское обеспечение</div>
<div class="big-banner-timer"></div>
<a href="#" class="button big color2">Купить сейчас<i class="las la-arrow-right"></i></a>
</div></div></div>
</section>
    
<section class="section">
<div class="cnt clr">
<div class="new-goods-carousel">
<h2 class="title-1">Новинки магазина</h2>
<div class="gcarouselwrap">
<span class="gcarouselarrow prev"><i class="las la-angle-left"></i></span>
<span class="gcarouselarrow next"><i class="las la-angle-right"></i></span>
<div class="gcarouselbody"><div class="gcarousel"><div class="goods-list with-clear">
{custom category="9" template="modules/custom1" aviable="global" from="0" limit="6" order="date"}
</div></div></div></div></div>
<div class="reviews-carousel">
<h2 class="title-1">Отзывы покупателей</h2>
<div class="gcarouselwrap">
<span class="gcarouselarrow prev"><i class="las la-angle-left"></i></span>
<span class="gcarouselarrow next"><i class="las la-angle-right"></i></span>
<div class="gcarouselbody"><div class="gcarousel"><div class="r-list">
{customcomments template="modules/custom3" available="global" from="0" limit="5" order="date"}
</div></div></div></div></div>
</div>
</section>
    
<section class="section banner-section">
<div class="cnt clr">
<div class="col2">
<div class="banner">
<img src="{THEME}/images/banner-6.jpg" alt="image">
<div class="banner-text">
<div class="banner-text-1">Xbox ONE S</div>
<div class="banner-text-2">Следует отметить, что консультация с широким активом своего покупателя</div>
<a href="#" class="button big color2">Купить<i class="las la-arrow-right"></i></a>
</div></div></div>
<div class="col2">
<div class="banner">
<img src="{THEME}/images/banner-7.jpg" alt="image">
<div class="banner-text">
<div class="banner-text-1">DJ Mavic PRO</div>
<div class="banner-text-2">Следует отметить, что консультация с широким активом своего покупателя</div>
<a href="#" class="button big color2">Купить<i class="las la-arrow-right"></i></a>
</div></div></div>
</div>
</section>
    
<section class="section">
<div class="cnt clr">
<h2 class="title-1">Свежее в блоге</h2>
<div class="gcarouselwrap">
<span class="gcarouselarrow prev"><i class="las la-angle-left"></i></span>
<span class="gcarouselarrow next"><i class="las la-angle-right"></i></span>
<div class="gcarouselbody"><div class="gcarousel"><div class="blog-list">
{custom category="1" template="modules/custom4" aviable="global" from="0" limit="6" order="date"}
</div></div></div></div></div>
</section>
    
<section class="section">
<div class="cnt clr">
<a href="#" class="brand"><img src="{THEME}/images/p-1.jpg" alt="img"></a>
<a href="#" class="brand"><img src="{THEME}/images/p-2.jpg" alt="img"></a>
<a href="#" class="brand"><img src="{THEME}/images/p-3.jpg" alt="img"></a>
<a href="#" class="brand"><img src="{THEME}/images/p-4.jpg" alt="img"></a>
<a href="#" class="brand"><img src="{THEME}/images/p-5.jpg" alt="img"></a>
<a href="#" class="brand"><img src="{THEME}/images/p-6.jpg" alt="img"></a>
</div>
</section>
    
[/available]
    
{include file="modules/footer.tpl"}
     
</div>

<div class="mobile-menu-container">
<div class="mobile-menu-container-close"><span title="Закрыть"></span></div>
</div>
        
{jsfiles}{AJAX}
<script src="{THEME}/js/plugins.js"></script>
<script src="{THEME}/js/scripts.js?v=1.0"></script>
<script src="{THEME}/js/shop.js"></script>
<script>$(function() {var date = new Date(), year = date.getFullYear() + 0,month = date.getMonth() + 0,day = date.getUTCDate() + 7,h = date.getHours() + 24,m = date.getMinutes(),s = date.getSeconds();date.setFullYear(year),date.setMonth(month),date.setUTCDate(day);date.setHours(h);date.setMinutes(m);date.setSeconds(s);endDate = date;$('.big-banner-timer').countdown({until: endDate, format: 'DHMS'});});</script>
<script src="{THEME}/js/fotorama.js"></script>
<script>function show_modal_dle() {$("#div_modal_dle").dialog({autoOpen: true,show: "fade",hide: "fade",width:400,modal: true,});}</script>
    
</body>
</html>