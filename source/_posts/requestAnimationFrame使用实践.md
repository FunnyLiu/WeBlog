---
title: requestAnimationFrame使用实践
date: 2016-06-22 21:19:12
categories: "javascript"
---

# **前言**

主要是使用requestAnimationFrame方法，并与setTimeout进行比较。

之前在一篇文章[浏览器高性能滑动解决方案](http://brizer.github.io/2016/06/11/%E6%B5%8F%E8%A7%88%E5%99%A8%E9%AB%98%E6%80%A7%E8%83%BD%E6%BB%91%E5%8A%A8%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/),提到过requestAnimationFrame，今天说说其在js动画中的运用。

---

# **原理**

该方法的原理其实就是每16.66ms执行一次函数，而16.66ms的来源是屏幕帧数决定的。至于为什么自行google。

---

# **栗子**

下面我们来看一段代码：
``` html
<style>
.container,.container2 {
    height:100px;
    overflow: hidden;  
}
</style> 
 
<div class="container">
    <div class="container-wrap j-wrap">
        <div class="lines">我是第一行</div>
        <div class="lines">我是第二行</div>
        <div class="lines">我是第三行</div>
        <div class="lines">我是第四行</div>
        <div class="lines">我是第五行</div>
        <div class="lines">我是第六行</div>
        <div class="lines">我是第七行</div>
        <div class="lines">我是第八行</div>
        <div class="lines">我是第九行</div>
        <div class="lines">我是第十行</div>
        <div class="lines">我是第十一行</div>
        <div class="lines">我是第十二行</div>        
    </div>
</div>
<div style="height:30px;"></div>
<div class="container2">
    <div class="container-wrap2 j-wrap2">
        <div class="lines">我是第一行</div>
        <div class="lines">我是第二行</div>
        <div class="lines">我是第三行</div>
        <div class="lines">我是第四行</div>
        <div class="lines">我是第五行</div>
        <div class="lines">我是第六行</div>
        <div class="lines">我是第七行</div>
        <div class="lines">我是第八行</div>
        <div class="lines">我是第九行</div>
        <div class="lines">我是第十行</div>
        <div class="lines">我是第十一行</div>
        <div class="lines">我是第十二行</div>        
    </div>
</div>
<script>
var $wrap = $('.j-wrap');
var marginTop = 0;
function setAnimate(){
    if(marginTop != (-212)){
        marginTop--;
        $wrap.css('marginTop',marginTop);
        setTimeout(setAnimate,1000/60);  
    }else{
        marginTop = 0;
        setTimeout(setAnimate,1000/60); 
    }
}
setAnimate();

var $wrap2 = $('.j-wrap2');
var marginTop2 = 0;
function setAnimate2(){
    if(marginTop2 != (-212)){
        marginTop2--;
        $wrap2.css('marginTop',marginTop2);
        requestAnimationFrame(setAnimate2);  
    }else{
        marginTop2 = 0;
        requestAnimationFrame(setAnimate2); 
    }
}
setAnimate2();
</script> 

```

两种实现方法效果是一模一样的：

<p data-height="265" data-theme-id="0" data-slug-hash="GqNObw" data-default-tab="html,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/GqNObw/">requestAnimationFrame使用实践</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>


这样是不是很流畅！有人说，我们无法用该方法控制速度呢，没有setTimeout灵活。笨蛋，**我们可以将动画函数中的px改变值相应变化，即可适应requestAnimationFrame啦**：

``` javascript
function setAnimate2(){
    if(marginTop2 != (-212)){
        /*这样就可以变慢啦*/
        marginTop2 = marginTop2 - 0.5;
        $wrap2.css('marginTop',marginTop2);
        requestAnimationFrame(setAnimate2);  
    }else{
        marginTop2 = 0;
        requestAnimationFrame(setAnimate2); 
    }
}
```

而且通过这样调整速度，比通过使用第一种方法修改setTimeout中的毫秒数更加流畅。


# **兼容性处理**
直接只用会有ie10以下兼容性问题,故而整理兼容解决方案:
``` javascript
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
```

使用时:
```
this.animate = g.requestAnimationFrame(this.setAnimate._$bind(this));

g.cancelAnimationFrame(this.animate);

```