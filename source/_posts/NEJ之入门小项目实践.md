---
title: NEJ之入门小项目实践
date: 2016-10-19 15:54:34
categories: "nej"
---

# **前言**

初次学习Nej的童鞋，可能由于官网API的难以理解，一直不能够透彻理解Nej的很多用法。首先我们看看[快速入门教程](http://nej.netease.com/course/quickStart),对Nej有一个基本的认识，这其中有些例子我会作为模块内容引入的。
下面就一步步通过构建一个小项目来理解Nej的一些功能。

---

# **模块调度**

Nej的模块系统，[官方文档](https://github.com/genify/nej/blob/master/doc/DISPATCHER.md)已经介绍的非常丰富了。
其思想就是**将页面的功能剥离成一个个的模块(module),由专门的模块调度器(dispatcher)对各个模块进行调度**，实现单个页面内复杂的功能。单页系统中最重要的就是路由的控制。笔者在开发这个小项目之初，就是为了体验Nej的路由功能。
这里主要是提供一个简单的入门模块控制demo，给初学者示例，当然笔者也是初学，大家共同进步。

可以通过下载[完整demo](https://github.com/brizer/brizer.github.io/tree/master/demo/NetEaseDemo),或者访问[在线demo](http://brizer.top/demo/NetEaseDemo/index.html#/m)。

先来说说本项目整体"架构",由于本人水平有限，勿喷。
- src
	- css
	- html **模板文件夹，按照各模块划分**
		- m
		- pages
		- regular **模块名称**
	- javascript
		- vender **存放第三方库如nej**
		- web **工程路径pro**
			- base **存放关键文件**
			- common **存放公共文件如指令、事件等**
			- module **各模块逻辑文件**
				- m
				- pages
				- regular
			- ui **各ui文件，按模块划分**
				- regular 
			- config.js **umi配置文件**
- index.html **入口文件**
- index.js

在项目入口文件进行文件依赖define,通过修改路径，即可对应自己的文件路径启动项目了：

``` html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NetEaseDemo</title>
<link rel="stylesheet" type="text/css" href="/demo/NetEaseDemo/src/css/bootstrap.css">
</head>
<body>
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <a class='navbar-brand' href="#/m">NetEaseDemo</a>
    </div>
</nav>
<div class="container">
    <div class="row" id="module-box">
    </div>
</div>
    
<!-- @VERSION -->
<script>location.config={root:'../NetEaseDemo/src/html/'};</script> 
<!-- @DEFINE -->
<script src="../NetEaseDemo/src/javascript/vendor/nej/src/define.js?pro=/demo/NetEaseDemo/src/javascript/web/"></script>
<script src="./index.js"></script>
</body>
</html>

```

index.js中开启模块调度器：
``` javascript
/**
 * 模块入口文件
 */
NEJ.define([
    'util/dispatcher/dispatcher',
    'pro/config'
],function(
    _p,
    _config
){
    _p._$startup(_config);
});
```

config为umi配置文件，如果umi复杂，可以单独提出一个umi文件统一管理，config.js如下：

``` javascript
/*
 * Netease Demo UMI实现文件
 */
NEJ.define([
    'util/dispatcher/dispatcher'
],function(_e){
    var _config = {
        //规则匹配
        rules:{
            rewrite:{
                //重写规则匹配
                '404':'/m'
            },
            title:{
                //标题匹配
            },
            alias:{
                //别名匹配
                //建议模块实现文件中的注册采用这里配置的别名
            }
        },
        //模块配置
        modules:{
            //模块UMI对应实现文件的映射表
            //同时完成模块的组合
            '/m':'m/index.html',

            //单页demo
            '/pages':'pages/index.html',
            '/pages/train':'pages/train/index.html',
            '/pages/datepicker':'pages/datepicker/index.html',
            '/pages/animate':'pages/animate/index.html',
            //regular相关demo
            '/regular':'regular/index.html',
            '/regular/helloworld':'/regular/helloworld/index.html',
            '/regular/todomvc':'/regular/todomvc/index.html'
        }
    };
	
    return _config;
});

```

我们以pages模块为例，html代码如下：

``` html
<meta charset="utf-8"/>

<textarea name="txt" id="pages-index">
    <div class='navbar-brand'>pages模块</div>
    <ul class="nav nav-tabs">
    	<li><a href="#/pages/train">火车Demo</a></li>
    	<li><a href="#/pages/datepicker">时间选择uiDemo</a></li>
    	<li><a href="#/pages/animate">动画Demo</a></li>		
    </ul>
    <div class="j-module" id="pages-content">
        
    </div>	
</textarea>

<!-- @TEMPLATE -->
<textarea name="js" data-src="/demo/NetEaseDemo/src/javascript/web/module/pages/index.js"></textarea>
<!-- /@TEMPLATE -->
```

模块对应的js代码，用来声明pages模块，并进入注册：
``` javascript

NEJ.define([
    '{lib}base/klass.js',
    '{lib}util/dispatcher/module.js',
    '{pro}base/module.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/template/tpl.js'
], function(_k, _m, _bm, _e, _v, _t, _p) {

    var _pro;

    // 扩展模块基类
    _p._$$PagesModule = _k._$klass();
    _pro = _p._$$PagesModule._$extend(_bm._$$Module);

    // 对于顶级模块, 可以重写__doParseParent方法
    // 确定整个应用的父容器.
    // 这里的module-box是容器的id.
    _pro.__doParseParent = function(options) {
        return _e._$get('module-box');
    }

    // 模块构建阶段
    // this.__body确定模块的html结构, 取出模板的html资源即可.
    _pro.__doBuild = function() {
        this.__body = _e._$html2node(_t._$getTextTemplate('pages-index'));

    }

    // 模块的显示
    _pro.__onShow = function(options) {
        // 除非你有自己的显示方式
        // 否则一定要调用父类方法
        // 此外options参数不要漏掉
        this.__super(options);

        // magic code
    }

    // 模块刷新
    _pro.__onRefresh = function(options) {
        this.__super(options);

        // magic code
    }

    // 其他 __onHide 等等

    // 监听document的templateready事件, 注册组件.
    _v._$addEvent(document, 'templateready', function() {
        _m._$regist('/pages', _p._$$PagesModule);
    });
});
```

其他模块也类似，这里就不再一一复述了。


---

# **与Regular结合**

小项目中的Regular模块均为使用Regular模板实现的demo。其中的Regular/todomvc模块是有多组件嵌套的demo。
首先通过base.js统一引用Regular，作为顶层ui文件：

``` javascript

NEJ.define([
    'pro/common/filter/base',
    'pro/common/directive/base',    
    'pro/common/event/base',
    '{pro}base/regular.js'
], function (_filter,_directive,_event,_r) {


    var _baseUI = Regular.extend({

    })
    .filter(_filter)
    .directive(_directive)
    .event(_event);

    return _baseUI;
});
```
通过另外的三个文件filter,directive,event统一管理项目中的过滤器、指令和自定义事件。
其他ui只需基础baseui即可。我们已todomvc中的todolist组件为例。
其模板文件较为复杂，这里只展示部分逻辑代码：

``` javascript
define([
    'regular!./todolist.html',
    '{pro}ui/regular/todomvc/todoitem/todoitem.js', 
    '{pro}common/ui/base.js'
], function(
    _tpl,
    _todoitem,
    _base
) {
    var _g = window;
    var todolistUI = _base.extend({
        name: 'todolist',
        template: _tpl,
        // get the list;
        computed: {
            completedLength: "this.getList('completed').length",
            activeLength: "this.getList('active').length",
            allCompleted: {
                get: function() {
                    return this.data.todos.length === this.getList('completed').length
                },
                set: function(sign) {
                    this.data.todos.forEach(function(item) {
                        item.completed = sign;
                    })
                }
            }
        },
        getList: function(filter) {
            if(!filter || filter === 'all') return this.data.todos;
            else return this.data.todos.filter(function(item) {
                return filter === 'completed' ? item.completed : !item.completed;
            });
        },
        // toggle all todo's completed state
        toggleAll: function(sign) {
            this.data.todos.forEach(function(item) {
                return item.completed = !sign;
            });
        },
        // clear all compleled
        clearCompleted: function() {
            this.data.todos = this.data.todos.filter(function(item) {
                return !item.completed
            });
        },
        // create a new todo
        newTodo: function(editTodo) {
            var data = this.data;
            data.todos.unshift({
                description: editTodo
            });
            data.editTodo = "";
        }
    });

    return todolistUI;
});
```
注意该ui由于需要内嵌其他ui，所以需要依赖todoitem。
再到对应的模块中以UI的形式调用即可：
``` javascript
NEJ.define([
    '{lib}base/klass.js',
    '{lib}util/dispatcher/module.js',
    '{pro}base/module.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/template/tpl.js',
    '{pro}ui/regular/todomvc/todolist/todolist.js',
], function(
    _k,
    _m,
    _bm,
    _e,
    _v,
    _t,
    _todolist,
    _p) {

    var _pro;
    var _prof;
    // 扩展模块基类
    _p._$$RegularTodomvcModule = _k._$klass();
    _pro = _p._$$RegularTodomvcModule._$extend(_bm._$$Module);

    // 对于顶级模块, 可以重写__doParseParent方法
    // 确定整个应用的父容器.
    _pro.__doParseParent = function(options) {
        return _e._$get('regular-content');
    }

    // 模块构建阶段
    // this.__body确定模块的html结构, 取出模板的html资源即可.
    _pro.__doBuild = function() {
        this.__body = _e._$html2node(_t._$getTextTemplate('regular-todomvc'));

    }

    // 模块的显示
    _pro.__onShow = function(options) {
        // 除非你有自己的显示方式
        // 否则一定要调用父类方法
        // 此外options参数不要漏掉
        this.__super(options);
        var todos = [
            {completed: true, description: "sleep" },
            {completed: false, description: "work" }        
        ];
        
        this._todolistUI = new _todolist({data:{todos:todos}}).$inject('#todomvcDemo');
        // magic code
    }

    // 模块刷新
    _pro.__onRefresh = function(options) {
        this.__super(options);

        // magic code

    };

    // 其他 __onHide 等等
    _pro.__onHide = function(){
        this.__super();
        if(!!this._todolistUI){
            this._todolistUI = this._todolistUI.destroy();
        }
    };
    // 监听document的templateready事件, 注册组件.
    _v._$addEvent(document, 'templateready', function() {
        _m._$regist('/regular/todomvc', _p._$$RegularTodomvcModule);
    });
});
```

---

未完待续...   后续还有尝试nej的打包等功能。