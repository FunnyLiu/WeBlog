---
title: 移动端滑动iscroll使用实践
date: 2016-06-06 09:29:29
categories: "web工程"
---

# **前言**

之前在移动适配页上的顶部导航条都是自己手写的，在有些平台上各种踩坑。于是决定调研下知名的iscroll，看看能不能解决我们的问题。该工具想必在使用后会有更多总结，现在只是简单实现一个demo。

---

# **iscroll**
模拟移动端滑动的库，有问题可以查阅[该文档](https://iiunknown.gitbooks.io/iscroll-5-api-cn/content/basicfeatures.html)。

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
    overflow: scroll;
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


