---
title: 面向对象和模块的javascript
date: 2016-06-21 20:06:59
categories: "javascript"
---

# **前言**

主要说说javascript中的构造函数，不同的定义方式实现不同功能的内部成员变量。以及最基本的小模块编写方式。

---

# **面向对象**

面向对象的javascript其实很多余，因为javascript中对象无处不在。
比如最简单的字面量：

``` javascript
var obj = {
	a:'123',
	b:function(){
        //todo
    }
}


```

构造函数存在的意义就是为了灵活地控制不同情况下的不同方法。

这里this，prototype这种基础就不再重复了。直接步入正题吧。

---

# **构造函数**

定义在构造函数原型链上的方法为**公有方法**。
定义在构造函数this上的方法为**特权方法**。
定义在构造函数内部的方法为**私有方法**。

举个例子来说明区别，构造函数如下：
``` javascript

function Person(name, family) {
    this.name = name;
    this.family = family;
    /*私有变量*/
    var records = [{type: "in", amount: 0}];
    /*私有方法，外部访问不到*/
    function privateFun(){
        //todo...
    };
    /*特权方法*/
    this.addTransaction = function(trans) {
        if(trans.hasOwnProperty("type") && trans.hasOwnProperty("amount")) {
           records.push(trans);
        }
    };

    this.balance = function() {
       var total = 0;

       records.forEach(function(record) {
           if(record.type === "in") {
             total += record.amount;
           }
           else {
             total -= record.amount;
           }
       });

        return total;
    };
};
/*公共方法*/
Person.prototype.getFull = function() {
    return this.name + " " + this.family;
};

Person.prototype.getProfile = function() {
     return this.getFull() + ", total balance: " + this.balance();
};
```

挂在prototype上的公共方法，在**第一次编译时就会生成**，它可以在该对象的每个实例中找到。

挂在构造函数this上的特权方法说动态生成的，它们是构造函数**被实例化时才添加到对象中**，虽然特权方法比公共方法开销大，但是更加灵活。

定义在构造函数内部的私有方法，通过**实例化的对象是访问不到的**。

以上就是三者的区别。

---

# **面向模块**

## 小模块

再来说说面向模块，模块化开发的AMD,CMD这里不再详细描述了，只说说在开发过程中最简单的小模块如何创建：
``` javascript

var _$$myModule = function(){
    /*私有变量*/
    var __privateCounter = 0;
    /*私有方法*/
    function __privateFunction(){
        _privateCounter++;
    }
    /*公有方法*/
    function _$addCounter(){
        __privateFunction();
    }
    function _$getCounter(){
        return __privateCounter;
    }
    /*暴露出去*/
    return {
        addCounter:_$addCounter,
        getCounter:_$getCounter
    };
}();

/*直接使用*/
_$$myModule.getCounter(); 

```

对于一些简单的业务场景，不需要用到构造函数这样复杂的情况，通过小模块保证块级作用域，一样可以获得很好的维护性和拓展性。

只不过这种小模块需要自己通过闭包将公有方法抛出去，还需要通过命名规范来区分公有方法和私有方法，不是很完美。

## requireJS模块

[官网介绍](http://www.requirejs.cn/).
首先是配置require的路径信息:
``` javascript
    var require = {
        baseUrl : '/javascripts',
        paths : {
            'jquery':'vendor/jquery-1.11.2.min',
            'regular':'vendor/regular.min',
            'rgl':'vendor/rgl',
            'text':'vendor/text'
        }
    }
```

各个模块html引入data-main:

``` html
<!--require模块写法-->
<script data-main="users/page/allUsers" type="text/javascript" src="/javascripts/vendor/require.js"></script>
```

allUsers模块定义如下:

``` javascript

define(['jquery','regular','/javascripts/rgui/users/usersList/usersList.js'],function(jq,Regular,usersListUI){
    var usersList;
    var addNewNode = $('.j-addNew');
    function init() {
        jq.get('/users/getAllUsers', cbGetAllUsers);
        bindEvent();
    }

    function cbGetAllUsers(data){
        if(!!data && data.result == 1){
            console.log(data);
            bulidUsersListUI(data.data);
        }else {
            alert('getAllUsers is Wrong!');
        }
    }
    function bulidUsersListUI(data){
        usersList = new usersListUI({
            data:{
                users:data
            }
        });
        usersList.$inject('#j-allUsers');
    }
    function bindEvent(){
        addNewNode.on('click',function(){
            window.location.href = '/users/addEditUser';
        });
    }

    init();
});

```