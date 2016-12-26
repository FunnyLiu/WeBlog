---
title: 移动web适配方案动态计算版
date: 2016-08-20 13:43:47
categories: "web工程"
---

# **前言**

以前整理过一篇移动端适配方案的文章，当时是在部门的专题cms系统中使用。[文章地址](http://brizer.github.io/2016/03/04/Sass%E4%B9%8B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/)

思路就是通过媒介查询整理出一套根字体大小，然后各个元素通过rem单位来进行适配。
而这次我们的根字体大小不再是通过媒介查询得到，而是通过屏幕宽度进行动态计算，并且还具有高分辨率屏幕的兼容性处理。

---

# **废话不多说，直接上源码**

好的知识当然需要大家一起共享才快乐。在此公开源码，方便大家共同进步。
js：

``` javascript
;(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    
    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem(){
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));

```


scss部分：

``` scss
/* 字体 */

@mixin font-dpr($font-size) {
    font-size: $font-size;
    [data-dpr="2"] & {
        font-size: $font-size * 2;
    }
    [data-dpr="3"] & {
        font-size: $font-size * 3;
    }
}


/* rem */
/* 我们项目的视觉稿为750px */
$rem-baseline: 75px !default;
@function rem-separator($list) {
    @if function-exists("list-separator")==true {
        @return list-separator($list);
    }
    $test-list: ();
    @each $item in $list {
        $test-list: append($test-list, $item, space);
    }
    @return if($test-list==$list, space, comma);
}

@mixin rem-baseline($zoom: 100%) {
    font-size: $zoom / 16px * $rem-baseline;
}

@function rem-convert($to, $values...) {
    $result: ();
    $separator: rem-separator($values);
    @each $value in $values {
        @if type-of($value)=="number" and unit($value)=="rem" and $to=="px" {
            $result: append($result, $value / 1rem * $rem-baseline, $separator);
        }
        @else if type-of($value)=="number" and unit($value)=="px" and $to=="rem" {
            $result: append($result, $value / ($rem-baseline / 1rem), $separator);
        }
        @else if type-of($value)=="list" {
            $result: append($result, rem-convert($to, $value...), $separator);
        }
        @else {
            $result: append($result, $value, $separator);
        }
    }
    @return if(length($result)==1, nth($result, 1), $result);
}

@function px2rem($values...) {
    //@if $rem-px-only {
    //    @return rem-convert(px, $values...);
    //} @else {
    @return rem-convert(rem, $values...);
    //}
}

@mixin px2rem($properties, $values...) {
    @if type-of($properties)=="map" {
        @each $property in map-keys($properties) {
            @include px2rem($property, map-get($properties, $property));
        }
    }
    @else {
        @each $property in $properties {
            //@if $rem-fallback or $rem-px-only {
            //    #{$property}: rem-convert(px, $values...);
            //}
            //@if not $rem-px-only {
            #{$property}: rem-convert(rem, $values...);
            //}
        }
    }
}

```


使用方式:

``` scss
.m-banner {
    height: px2rem(640px);    
    &-introduction {      
        margin:0 auto;
        padding:px2rem(110px) 0 px2rem(40px) 0;  
        width: px2rem(660px);
        font-size: px2rem(66px);
        line-height: px2rem(90px);
        text-align: center;
    }
    &-detailDescription {
        margin: 0 auto;
        width: px2rem(660px);
        font-size: px2rem(24px);
        line-height: px2rem(36px);
        text-align: center;
    }
    &-video {
        left: 50%;
        margin: px2rem(60px) 0 0 px2rem(-50px);
        width: px2rem(100px);
        height: px2rem(100px);
        background: url(http://nos.netease.com/edu-image/3AB7C15D5AF4FD7C573E34D05535F5F8.png) no-repeat;
        background-size: 100%;
    }
}

```