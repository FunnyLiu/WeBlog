---
title: javascript的api设计技巧
date: 2016-06-14 16:42:08
categories: "javascript"
---

# **前言**

这里所指的api，其实就是一个给他人或者自己或者回调的函数和方法，主要说说在编写这样的方法时的一些原则和有效的处理方式。

---

# **参数的处理**

首先，我们需要考虑到代码的鲁棒性，不能因为参数的错误就导致整个程序运行崩溃。我们需要对参数进行验证：
``` javascript
//需要传入字符串
function setColor(color) {
    if(typeof color !== 'string') return;
    //todo
}
//需要传入对象
function setObj(obj) {
    if(typeof obj !== 'object') return;
    //todo
}
//不能为空
function setObj(obj) {
    if(obj === undefined) return;
    //todo
}
```

针对字符串，如果我们需要**确保参数的类型**为字符串或数字或布尔值，可以进行如下转化：
``` javascript
function castaway(some_string, some_integer, some_boolean) {
    some_string += "";
    some_integer -= 0; // parseInt(some_integer, 10) 更安全些
    some_boolean = !!some_boolean;
}
```

其次，针对对象类型，我们需要确保方法内部访问该对象的某些属性时不会报错从而影响程序的政策进行，所以我们最好可以设置默认值，这一点我以jquery的extend方法为例：
``` javascript
function getTips(options) {
    options = $.extend({
        obj: null,  //jq对象，要在那个html标签上显示
        str: "+1",  //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>"
        startSize: "12px",  //动画开始的文字大小
        endSize: "30px",    //动画结束的文字大小
        interval: 600,  //动画时间间隔
        color: "red",    //文字颜色
        callback: function () { }    //回调函数
	}, options);
	//todo
}	
```
或者进行简单的处理：
``` javascript
    options = options || {};
```

---

# **可扩展性**

设计的方法最好具有可扩展性，就是说别人可以在不修改你的方法的基础上进行一定的添加改进。这里看一个例子：
``` javascript
function set(selector, color) {
    document.querySelectroAll(selector).style.color = color;
    document.querySelectroAll(selector).style.backgroundColor = color;
}
```

这个方法就没有扩展性，如果我现在需要多改变一个字体大小，就得修改set函数本身。但是随着set方法越来越复杂，其中的逻辑并不适合一直改来改去。我们进行如下修改：
``` javascript
function set(selector, color) {
    var el = document.querySelectroAll(selector);
    el.style.color = color;
    el.style.backgroundColor = color;
    return el;
}
```

如果我们需要再设置字体的话，只需要用一个代理即可：
``` javascript
function setAgain (selector, color, px) {
    var el = set(selector, color)
    el.style.fontSize = px;
    return el;
}
```

这样就实现了扩展。

---

# **处理异常**

最后是对异常的处理，在有可能出错的位置进行相应的异常处理。
``` javascript
function error (a) {
    if(typeof a !== 'string') {
        console.error('param a must be type of string')
    }
}
 
function error() {
    try {
        // todo
    }catch(ex) {
        console.wran(ex);
    }
}
```

