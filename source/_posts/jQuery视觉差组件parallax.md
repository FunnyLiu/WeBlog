---
title: jQuery视觉差组件parallax
date: 2016-11-22 11:06:32
categories: "jquery"
---

# **前言**
之前看过京东双十一头图就是一个视觉差的效果,看了下其原理,其实就是多个图片呈不同层级,
然后根据鼠标移动的位置,进过一系列复杂计算,得出不同层级的图片对应应该移动的距离,并
平稳移动.
发现一个jquery组件parallax可以简单实现此特效,想想以后可以用到自己部门的专题开发
中来,特此调研整理.

---

# **介绍**
[官网及API](http://stephen.band/jparallax/)

[简单的demo](/demo/pagesDemo/parallax.html)

[不同层级不同配置的demo](/demo/pagesDemo/parallax_new.html)

---

# **使用方法**
上面的简单demo,其源码如下:
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>视觉差效果</title>
    <script src="./js/jquery-1.7.2.min.js"></script>
    <script src="./js/jquery.jparallax.min.js"></script>
    <style>
        #parallax {position:relative; overflow:hidden; width:950px; height:250px;
            background-image:url('imgs/parallax_background.jpg');}
        .layer{ position: absolute;}
    </style>
</head>
<body>
<div id="parallax">
    <div class="layer" style="width:1200px; height:250px;">
        <img src="imgs/parallax_grass.png" style="width:1200px; height:250px;"/>
    </div>
    <div class="layer" style="width:500px; height:250px;">
        <img src="imgs/parallax_frog2.png" style="width:500px; height:250px;"/>
    </div>
    <div class="layer" style="width:1200px; height:300px;">
        <img src="imgs/parallax_butterflies3.png"  style="width:1200px; height:300px;"/>
    </div>
</div>
<script>
    $(document).ready(function(e) {
        $('#parallax .layer').parallax({
            mouseport:$('#parallax'),
            xparallax:'20%',//x轴可移动范围
            decay:0.66,//响应鼠标的速度
            xorigin:0.2//鼠标初次移动上去,各元素x轴偏移位置
        });
    });
</script>
</body>
</html>
```

效果如下:
<iframe src="/demo/pagesDemo/parallax.html" width="620px" height="250px"></iframe>

具体的配置项可以参考官网,这里值得一提的是,大多数情况下,我们都需要不同层级不同的配置,比如说移动速度或者图片的移动范围等.多层级不同配置方法如下:
``` javascript
    $(document).ready(function(e) {
        $('#parallax .layer').parallax({
            mouseport:$('#parallax'),
            decay:0.66,//响应鼠标的速度
            xorigin:0.2//鼠标初次移动上去,各元素x轴偏移位置
        },{
            //第一层额外配置
            xparallax:'20%',//x轴可移动范围
        },{
            //第二层额外配置
            xparallax:'30%',//x轴可移动范围
        },{
            //第三层额外配置
            xparallax:'80%',//x轴可移动范围
        });
    });
```

效果如下:
<iframe src="/demo/pagesDemo/parallax_new.html" width="620px" height="250px"></iframe>

