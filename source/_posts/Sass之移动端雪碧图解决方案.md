---
title: Sass之移动端雪碧图解决方案
date: 2016-05-21 13:43:48
categories: "css"
---

# **前言**

网易的同事整理了一套在移动端使用雪碧图的近乎完美解决方案，特此整理，方便日后使用。

---

# **推导过程**

注重原理的同学可以看看[柏林大牛的文章](http://www.jianshu.com/p/d3b19968a4c2),里面有详细的推导过程。我就不再重复了。

---

# **使用方法**

首先需要配合移动端适配的rem来：
``` scss
/*移动端适配 width|height|font-size = 视觉稿量出来的值 / 100rem;@lbl*/
@media screen and (max-width:359px) and (min-width:320px) {
    html,body{
        font-size: 50px !important;
    }
}
@media screen and (max-width:374px) and (min-width:360px) {
    html,body{
        font-size: 56.25px !important;
    }
}
@media screen and (max-width:413px) and (min-width:375px) {
   html,body{
        font-size: 58.594px !important;
    }
}
@media screen and (max-width:639px)  and (min-width:414px){
   html,body{
        font-size: 64.687px !important;
    }
}@media screen and (min-width:640px) {
   html,body{
        font-size: 100px !important;
    }
}


```

然后加上css雪碧图的mixin：

``` scss
//$spriteWidth 雪碧图的宽度px
//$spriteHeight 雪碧图的高度px
//$iconWidth 需要显示icon的宽度px
//$iconHeight 需要显示icon的高度px
//$iconX icon的原始x坐标,也就是background-posotion中的负值
//$iconY icon的原始y坐标
//使用@include bgPositionSameSpriteAndWidth(80, 10);
@mixin bgPosition($spriteWidth, $spriteHeight, $iconWidth, $iconHeight, $iconX, $iconY){

    background-position: (($iconX / ($spriteWidth - $iconWidth)) * 100% ($iconY / ($spriteHeight - $iconHeight)) * 100%); 
}


```

在此基础上可以在某些特定情况下简化：
``` scss
//同一张sprite图并且每个icon的大小相同
@mixin bgPositionSameSpriteAndWidth($iconX, $iconY){

    $spriteWidth : 220;
    $spriteHeight : 220;
    $iconWidth : 61;
    $iconHeight : 61;

    @include bgPosition($spriteWidth, $spriteHeight, $iconWidth, $iconHeight, $iconX, $iconY);
}			
```

另外，需要注意给背景图设置**background-size**属性，也是rem单位。

---

# **使用案例**

最后来个栗子：
``` scss
//同一张sprite图并且每个icon的大小相同
@mixin bgPositionSameSpriteAndWidth($iconX, $iconY){

    $spriteWidth : 220;
    $spriteHeight : 220;
    $iconWidth : 61;
    $iconHeight : 61;

    @include bgPosition($spriteWidth, $spriteHeight, $iconWidth, $iconHeight, $iconX, $iconY);
}
//使用
i{
    padding-top: 100%;
    width: 100%;
    display: block;
    background: url(http://nos.netease.com/edu-image/3A65D313376F13CE75CE01C2593BD1CE.png) 0 0 no-repeat;
    background-size: 2.2rem 2.2rem;
}

.i-sina{
    @include bgPositionSameSpriteAndWidth(10, 10);
}

.i-qzone{
    @include bgPositionSameSpriteAndWidth(80, 10);
}

.i-qq{
    @include bgPositionSameSpriteAndWidth(150, 10);
}

.i-douban{
    @include bgPositionSameSpriteAndWidth(10, 80);
}

.i-yixin{
    @include bgPositionSameSpriteAndWidth(80, 80);
}

.i-renren{
    @include bgPositionSameSpriteAndWidth(150, 80);
}
```

完美解决问题，是不是很嗨。