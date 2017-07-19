---
title: js模拟实现系列
date: 2017-07-02 13:28:46
categories: "javascript"
---

# 前言
这篇模拟实现系列，主要会对javascript中原生的一些方法进行原理分析，并模拟实现其效果，进一步理解其原理和过程。
对自己理解javascript这门语言有一定的帮助。

# 各种模拟实现开始啦

## call
call方法虽然没有apply方法常用，但是他们的区别不大，故而从call开始理解。
首先需要知道call方法的特点。
第一个特点是使**用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法**
比如：
```javascript

var foo = {
    value: 1
};
 
function bar() {
    console.log(this.value);
}
 
bar.call(foo); // 1

```
故而实现为：
```javascript

// 第一版
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this;
    context.fn();
    delete context.fn;
}

```
第二个特点是**可以传参数**，比如：
```javascript

var foo = {
    value: 1
};
 
function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}
 
bar.call(foo, 'kevin', 18);
// kevin
// 18
// 1
```

故而实现为：
```javascript

// 第二版
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    //取出参数
    for(var i = 1, len = arguments.length; i  len; i++) {
        args.push('arguments[' + i + ']');
    }
    //通过eval执行js
    eval('context.fn(' + args +')');
    delete context.fn;
}
```

第三个特点，**传参为null时，指向window，再者函数可以有返回值**，比如：
```javascript

var obj = {
    value: 1
}
 
function bar(name, age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}
 
console.log(bar.call(obj, 'kevin', 18));
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

故而实现为：
```javascript

// 第三版
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;
 
    var args = [];
    for(var i = 1, len = arguments.length; i  len; i++) {
        args.push('arguments[' + i + ']');
    }
 
    var result = eval('context.fn(' + args +')');
 
    delete context.fn
    return result;
}
 
```

## apply
apply和call类似，两者的区别在于**call是将参数一个个的传入，而apply是将参数以数组的形式传入**。
故而参考模拟实现call方法，得出apply的模拟实现方法如下：
```javascript
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;
 
    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i  < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }
 
    delete context.fn;
    return result;
}
```

## bind
bind方法是在改变this指向的基础上，返回一个函数。
首先需要清楚bind方法的几个特点。
第一个就是，bind方法会**返回一个函数**：
```javascript

var foo = {
    value: 1
};
 
function bar() {
    console.log(this.value);
}
 
// 返回了一个函数
var bindFoo = bar.bind(foo);
 
bindFoo(); // 1
```

故而实现为：
```javascript

Function.prototype.bind2 = function (context) {
    var self = this;
    return function () {
        self.apply(context);
    }
 
}
```

第二个特点，bind方法**可以传入参数**：
```javascript

var foo = {
    value: 1
};
 
function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);
 
}
 
var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```

故而实现为：
```javascript

// 第二版
Function.prototype.bind2 = function (context) {
 
    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
 
    return function () {
        // 这个时候的arguments是指bind返回的函数传入的参数，也就是上面例子中的18
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(context, args.concat(bindArgs));
    }
 
}

```

bind还有一个最复杂的特点，就是**当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效**，但传入的参数依然生效：
```javascript

var value = 2;
 
var foo = {
    value: 1
};
 
function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
 
bar.prototype.friend = 'kevin';
 
var bindFoo = bar.bind(foo, 'daisy');
 
var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

可以看到value取不到，这是因为this已经由于new操作而指向了obj。
故而实现为：
```javascript

Function.prototype.bind2 = function (context) {
 
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
 
    var fNOP = function () {};
 
    var fbound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(this instanceof self ? this : context, args.concat(bindArgs));
    }
    //使用空函数进行中转
    fNOP.prototype = this.prototype;
    fbound.prototype = new fNOP();
    return fbound;
 
}
```

当然，第三种就考虑的较为全面，也比较复杂。


## new

先来看看new的功能：
```javascript
// Otaku 御宅族，简称宅
function Otaku (name, age) {
    this.name = name;
    this.age = age;
 
    this.habit = 'Games';
}
 
// 因为缺乏锻炼的缘故，身体强度让人担忧
Otaku.prototype.strength = 60;
 
Otaku.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}
 
var person = new Otaku('Kevin', '18');
 
console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60
 
person.sayYourName(); // I am Kevin
```

我们的实现用法如下：
```javascript
function Otaku () {
    ……
}
 
// 使用 new
var person = new Otaku(……);
// 使用 objectFactory
var person = objectFactory(Otaku, ……)
```

具体实现：
```javascript

function objectFactory() {
    //首先创建对象
    var obj = new Object(),
    //取出第一个参数作为构造函数
    Constructor = [].shift.call(arguments);
    //将obj的原型指向构造函数，这样obj就可以访问构造函数原型中的属性了
    obj.prototype = Constructor.prototype;
    //修改this的指向
    var ret = Constructor.apply(obj, arguments);
    //如果构造函数返回基本类型值，也需返回对象
    return typeof ret === 'object' ? ret : obj;
 
};
```

其实就是新建一个Object，将原型指向构造函数的原型。