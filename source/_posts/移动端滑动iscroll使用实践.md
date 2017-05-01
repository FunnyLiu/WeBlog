---
title: 移动端滑动iscroll使用实践
date: 2016-06-06 09:29:29
categories: "web工程"
---

# **前言**

之前在移动适配页上的顶部导航条都是自己手写的，在有些平台上各种踩坑。于是决定调研下知名的iscroll，看看能不能解决我们的问题。该工具想必在使用后会有更多总结，现在只是简单实现一个demo。

---

# **iscroll**
模拟移动端滑动的库，有问题可以查阅[该文档](https://github.com/cubiq/iscroll)。

## **初始化**
基本结构：
``` html 
<script type="text/javascript" src="iscroll.js"></script>
<script type="text/javascript">
var myScroll;
function loaded() {
    myScroll = new IScroll('#wrapper');
}
</script>
...
<body onload="loaded()">
<div id="wrapper">
    <ul>
        <li>...</li>
        <li>...</li>
        ...
    </ul>
</div>
</body>
```

---

## **核心配置**

### options.useTransform
默认值：true
是否使用css的transform属性，如果false，则用left,top替代。

### options.useTransition
默认值：true
是否使用css动画，如果false，则用requestAnimationFrame替代。

### options.HWCompositing
默认值：true
是否用translateZ(0)来开启硬件加速。最好为true，极大提高性能，但是如果元素过多，也可以设置为false。

---

## **基本配置**

### options.bounce
默认值：true
滑动到边缘的反弹动画，静止可提高性能。

### options.click
默认值：false
是否开启点击事件，建议使用tap而不是click，如果需要开启click，设置为true

### options.disableMouse
### options.disablePointer
### options.disableTouch
默认值：false
可以设置为true，来禁止相应的事件，从而节约资源.

### options.eventPassthrough
默认值：false
横向滚动iscroll区域，纵向滚动整个页面。[demo](http://lab.cubiq.org/iscroll5/demos/event-passthrough/)
``` javascript
myScroll = new IScroll('#wrapper', { eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false });
```

### options.freeScroll
默认值：false
即可横向，又可纵向滑动。[demo](http://lab.cubiq.org/iscroll5/demos/2d-scroll/)
``` javascript
myScroll = new IScroll('#wrapper', { scrollX: true, freeScroll: true });
```

### options.keyBindings
默认值：false
键盘事件，[具体文档](https://github.com/cubiq/iscroll#key-bindings)

### options.invertWheelDirection
默认值：false
反转滚轮，只有当鼠标滚轮启用时有用，反转滚轮的方向

### options.momentum
默认值：true
用户快速点击屏幕的动画，关闭可极大提高性能

需要和bounce配合使用,体验笔记好,demo:
``` javascript
myScroll = new IScroll('.j-navs',
        {
            click: true,//允许点击事件
            eventPassthrough: true,//纵向滚动整个页面，横向滚动iscroll区域
            scrollX:true,//默认是纵向，横向需要设置scrollX
            bounce:true,//反弹动画,提高体验
            momentum:true
        });

```

### options.mouseWheel
默认值：false
鼠标事件监听，方便PC端调试

### options.preventDefault
默认值：true
阻止默认行为

### options.scrollX
默认值：false
默认是纵向，需开启后变为横向。

### options.scrollY
默认值：true
默认纵向滑动

### options.startX
### options.startY
默认值：0
iscroll区域的开始位置。

### options.tap
默认值：false
设置为true，使得iscroll区域被点击后触发事件监听：
``` javascript
element.addEventListener('tap', doSomething, false); \\ Native
$('#element').on('tap', doSomething); \\ jQuery
```
或者通过参数形式监听
``` javascript
tap: 'myCustomTapEvent'
```

---

## **滚动条设置**

### options.scrollbars
默认值:false
开启滚动条，并进行各种设置。
``` javascript
var myScroll = new IScroll('#wrapper', {
    scrollbars: true
});
```

### options.fadeScrollbars
默认值：false
设置为true时，滚动条可消失。

### options.interactiveScrollbars
默认值：false
设置为true是，滚动条可以拖动并进行定义

### options.resizeScrollbars
默认值：true
滚动条的大小基于iscroll区域的大小。设置为false，则以固定大小呈现，通常与自定义样式一起使用。

### options.shrinkScrollbars
默认值：false
可以设置为clip何scale。在滚动条拖放到边界时启用。
scale是滚动条在边界时缩放，clip是滚动条在边界时裁剪。
一个[scale的demo](http://lab.cubiq.org/iscroll5/demos/scrollbars/)
``` javascript
myScroll = new IScroll('#wrapper', {
    scrollbars: true,
    mouseWheel: true,
    interactiveScrollbars: true,
    shrinkScrollbars: 'scale',
    fadeScrollbars: true
});
```
### 自定义进度条
[详细文档](https://github.com/cubiq/iscroll#styling-the-scrollbar)

---
## **指示器设置**
指示器类似于电商网站中的商品拖拽放大查看器。其定义看起来像这样：
``` javascript
var myScroll = new IScroll('#wrapper', {
    indicators: {
        el: [element|element selector]
        fade: false,
        ignoreBoundaries: false,
        interactive: false,
        listenX: true,
        listenY: true,
        resize: true,
        shrink: false,
        speedRatioX: 0,
        speedRatioY: 0,
    }
});
```

### options.indicators.el
强制属性，持有该滚动条的容器，容器的第一个子节点就是指示器：
``` javascript
indicators: {
    el: document.getElementById('indicator')
}
```

### options.indicators.ignoreBoundaries
默认值:fales
告诉指示器忽略边界，从而改变滚动条的速度。可用来做视觉差组件。
[视觉差demo](http://lab.cubiq.org/iscroll5/demos/parallax/)
``` html
<div id="wrapper">
    <div id="scroller"></div>
</div>

<div class="starfield" id="starfield1">
    <div id="stars1"></div>
</div>

<div class="starfield" id="starfield2">
    <div id="stars2"></div>
</div>
<script>
myScroll = new IScroll('#wrapper', {
    mouseWheel: true,
    indicators: [{
        el: document.getElementById('starfield1'),
        resize: false,
        ignoreBoundaries: true,
        speedRatioY: 0.4
    }, {
        el: document.getElementById('starfield2'),
        resize: false,
        ignoreBoundaries: true,
        speedRatioY: 0.2
    }]
});
</script>
```

### options.indicators.listenX
### options.indicators.listenY
默认值：true
确定指示器的监听坐标方向。

### options.indicators.speedRatioX
### options.indicators.speedRatioY
默认值：0
指示器的移动速度

### options.indicators.fade
### options.indicators.interactive
### options.indicators.resize
### options.indicators.shrink
和scrollbar的设置类似，可以直接看[demo](http://lab.cubiq.org/iscroll5/demos/minimap/)
``` html
<div id="wrapper">
    <div id="scroller"></div>
</div>

<div id="minimap">
    <div id="minimap-indicator"></div>
</div>

<ul id="bookmarks">
    <li><a href="javascript:myScroll.scrollTo(-359, -85, 400, IScroll.utils.ease.back)">Face</a></li>
    <li><a href="javascript:myScroll.scrollTo(-288, -342, 400, IScroll.utils.ease.back)">Necklace</a></li>
    <li><a href="javascript:myScroll.scrollTo(-264, -658, 400, IScroll.utils.ease.back)">Hand</a></li>
    <li><a href="javascript:myScroll.scrollTo(-383, -539, 400, IScroll.utils.ease.back)">Ermine</a></li>
</ul>
<script>
    myScroll = new IScroll('#wrapper', {
        startX: -359,
        startY: -85,
        scrollY: true,
        scrollX: true,
        freeScroll: true,
        mouseWheel: true,
        indicators: {
            el: document.getElementById('minimap'),
            interactive: true
        }
    });
</script>
```

---

## **常用API**

### scrollTo(x, y, time, easing)
举例，如下会下滑到-100px的位置：
``` javascript
myScroll.scrollTo(0, -100);
```
也可加上一定的时间和渐变效果：
``` javascript
myScroll.scrollTo(0, -100, 1000, IScroll.utils.ease.elastic);
```
uitils.ease 有属性： quadratic, circular, back, bounce, elastic.

### scrollBy(x, y, time, easing)
举例，如下你会从-100px处下滑到-110px处：
``` javascript
myScroll.scrollBy(0, -10);
```

### scrollToElement(el, time, offsetX, offsetY, easing)
可以查看[demo](http://lab.cubiq.org/iscroll5/demos/scroll-to-element/)
用法可以参考文章后面的简单小demo中的移动端导航居中效果。

### refresh()
刷新iscroll。
如果我们在实例化IScroll后，又改变了其内部DOM节点的结构或者样式，就需要手动refresh刷新一下。

例如我们一个常见的需求，就是通过iscroll来设置导航。会在实例化iscroll前对导航所在div的宽度进行计算：
``` javascript
this._setScrollWidth();

this.myScroll = new IScroll('.j-navs',
    {
        click: true,//允许点击事件
        eventPassthrough: false,//纵向滚动整个页面，横向滚动iscroll区域
        scrollX:true,//默认是纵向，横向需要设置scrollX
        bounce:true,//反弹动画,提高体验
        momentum:true,
        preventDefault: false

    });
```

如果我们颠倒顺序，先执行实例化操作，再计算宽度并设置给iscroll区域内的dom，就会发现iscroll失效。这时需要手动refresh一下，才能正常激活：
```javascript

this.myScroll = new IScroll('.j-navs',
    {
        click: true,//允许点击事件
        eventPassthrough: false,//纵向滚动整个页面，横向滚动iscroll区域
        scrollX:true,//默认是纵向，横向需要设置scrollX
        bounce:true,//反弹动画,提高体验
        momentum:true,
        preventDefault: false

    });

this._setScrollWidth();

this.myScroll.refresh();

```

---

# **一个简单的小demo**

[demo地址](/demo/pagesDemo/m_iscroll_nav.html),使用移动调试模式观看.
也可以直接进行访问:
![img](移动端滑动iscroll使用实践/demo.png)

其中html结构为:
``` html
<div class="u-nav" id="wrapper">
    <ul class="j-nav">
        <li class="j-spe">导航1</li>
        <li>导航2</li>
        <li>导航3</li>
        <li>导航4</li>
        <li>导航5</li>
        <li>导航6</li>
        <li>导航7</li>
        <li>导航8</li>
    </ul>
</div>
<div class="u-content">
    <div class="u-content-item">第1个</div>
    <div class="u-content-item">第2个</div>
    <div class="u-content-item">第3个</div>
    <div class="u-content-item">第4个</div>
    <div class="u-content-item">第5个</div>
    <div class="u-content-item">第6个</div>
    <div class="u-content-item">第7个</div>
    <div class="u-content-item">第8个</div>
</div>
```

scss为:
``` scss
body {
    margin:0;
    width:100%;
}
li {
    list-style-type:none;
}
.u-nav {
    top:0;
    left:0;
    width:100%;
    overflow: hidden;
    ul {
        padding:0;
        width:800px;
        height:60px;
        font-size:0;
        li {
            display:inline-block;
            width:100px;
            height:60px;
            color:#fff;
            font-size:12px;
            background-color:red;
            &.active {
                background-color: blue;
            }
        }
    }
}
.u-content {
    width:100%;
    &-item {
        height:800px;
        &:nth-of-type(2n+1){
            background:yellow;
        }
        &:nth-of-type(2n){
            background:green;
        }
    }
}
```

js依赖jquery和[iscroll](/demo/pagesDemo/js/iscroll.js)

``` javascript
    ;(function(){
        var tid;
        var myScroll;

        myScroll = new IScroll('#wrapper',
            {
                mouseWheel: true,//PC端的鼠标事件也监听，方便PC端调试
                click: true,//允许点击事件
                eventPassthrough: true,//纵向滚动整个页面，横向滚动iscroll区域
                scrollX:true,//默认是纵向，横向需要设置scrollX
                bounce:false,//静止反弹动画,提高性能
            });

        var _$nav = $('.j-nav');
        var _$spe = $('.j-spe');
        var _$wra = $('#wrapper');
        var offsetTop = [];
        //获取各div距离顶部距离列表
        for(var i=0;i<8;i++){
            offsetTop[i] = $('.u-content-item').eq(i).offset().top;
        }

        //导航栏点击事件
        _$nav.on('click','li',function(){
            var _index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $(window).scrollTop((_index)*800-60);
            /*滑动到指定索引的导航节点从左开始第一个显示*/
            //myScroll.scrollToElement(_$nav.find('li:nth-child(4)').get(0));
            /*滑动到指定索引的导航节点，并将其居中显示*/
            myScroll.scrollToElement(_$nav.find('li:nth-child('+(_index+1)+')').get(0),null,true,true);
            var _index = $(this).index();
            //防止点击后滑动逻辑影响结果

            $(window).off('scroll');
            setTimeout(function(){
                $(window).on('scroll',function(e){
                    reduce();
                });
            },10);
        });
        //屏幕滑动,对应导航选中
        $(window).on('scroll',function(e){
            reduce();
        });
        /*节流*/
        function reduce() {
            clearTimeout(tid);
            //速度可以根据性能需求调整
            tid = setTimeout(refreshScroll, 10)
        };
        function refreshScroll(){
            var scrollTop = $(this).scrollTop();
            console.log(scrollTop);
            if(scrollTop>=0){
                _$wra.css('position','fixed');
            }else{
                _$wra.css('position','static');
            }
            var _$selected;
            for(var i=0;i<8;i++){
                if(scrollTop>offsetTop[i]&&scrollTop<offsetTop[i+1]){
                    _$selected = _$nav.children().eq(i);
                    _$selected.addClass('active').siblings().removeClass('active');
                    myScroll.scrollToElement(_$selected.get(0),null,true,true);
                }
                if(scrollTop>offsetTop[8-1]){
                    _$selected = _$nav.children().eq(8-1);
                    _$nav.children().eq(8-1).addClass('active').siblings().removeClass('active');
                    myScroll.scrollToElement(_$selected.get(0),null,true,true);
                }
            }

        }
        /*滑动到哪个区域就激活当前区域，这里默认滑动到第一个，滑动到指定区域的逻辑不再写*/
        setTimeout(function(){
            _$spe.click();
        },300);
```

最后效果:

<iframe src="/demo/pagesDemo/m_iscroll_nav.html" width="320px" height="568px"></iframe>


代码耦合性比较强,需要知道各个模块的高度,且固定于代码中了,故迁移性不高,但是已经可以满足基本使用了.待日后有机会整理成插件.


