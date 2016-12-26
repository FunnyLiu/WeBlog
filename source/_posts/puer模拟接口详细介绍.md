---
title: puer模拟接口详细介绍
date: 2016-05-01 16:33:24
categories: "web工程"
---

# **前言**
puer是一款比较简便，功能又比较强大的工具，我在[puer使用手册](http://brizer.github.io/2016/04/01/puer%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C/)中提到过它的一些用法，但是当时对其本地调试接口的功能并没有深究，直到后来自己在现实环境中需要使用时，才追悔莫及，所以这次特地为puer模拟接口的功能进行详细的介绍。

---

# **get**
route.js的配置和使用我这里就不再讲了，前面提到的文章中有说到。
首先看看get方式的请求，这里以jquery的方法为例，我们需要获取到get的参数：

``` javascript
	var $ajax1 = $('.j-ajax1');
	$ajax1.click(function(){
		$.ajax({
			url:'/get/getMyInfo?id=123',
			method:'get',
		}).success(function(data){
			console.log(data);//Object {name: "刘放", age: 24, param: "123"}
		});
	});
```

需要在route.js中如下配置：

``` javascript
  "GET /get/getMyInfo":function(req,res,next){
    res.send({
		  name:"刘放",
		  age:24,
		  param:req.query.id
	  })
  },
```

注意，参数都是用**req.query**来获取。

如果说get请求时不是通过哈希传参数，而是通过路由：

``` javascript
    var $ajax2 = $('.j-ajax2');
    $ajax2.click(function(){
        $.ajax({
        	url:'/get/page/2',
        	method:'get'
        }).success(function(data){
            console.log(data);//Object {totalPage: 14, lists: Array[2], currentPage: "2"}
        });
    });
```

我们则需要通过**req.params**来获取参数，还是在route.js中：

``` javascript
  "GET /get/page/:pageIndex":function(req,res,next){
    res.send({
      totalPage:14,
      lists:[
        {id:1,name:'li-1'},
        {id:2,name:'li-2'}
      ],
      currentPage:req.params.pageIndex
    });
  },  
```
注意这里的请求路由配置中的`:pageIndex`,可想而知，这里可以根据业务逻辑配置得非常灵活。

---

# **post**

再来看看post请求：

``` javascript
    var $ajax4 = $('.j-ajax4');
    $ajax4.click(function(){
        $.ajax({
        	url:'/post/setNum',
        	method:'post',
        	data:{a:1,b:2}
        }).success(function(data){
            console.log(data);//Object {num: 3}
        });
    });    

```

在route.js中，我们需要通过**req.body**来获取参数进行处理：

``` javascript
  "POST /post/setNum": function(req,res,next){
    res.send({
      num:(req.body.a-0)+(req.body.b-0)
    })
  },  
```

---

# **感悟**

其实整个接口模拟的规范，是参考[express框架](http://expressjs.com/en/3x/api.html)的。只是对于不了解node的初学者来说，有点不知所云，所以这里进行了简单的整理，日常的需求应该够用了。

至于为何需要本地模拟数据，当前后端分离后，后端的数据结构确定但数据未填充时，前端可以通过本地模拟的方法来进行预开发，之后直接联调即可。而且如果遇到跨部门或者跨公司的功能，对方不给jsonp格式，**无法跨域**时，联调会非常麻烦，所以本地模拟接口还是较为重要的。
