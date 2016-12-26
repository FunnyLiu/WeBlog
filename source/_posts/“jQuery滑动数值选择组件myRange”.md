---
title: “jQuery滑动数值选择组件myRange”
date: 2016-12-06 20:46:29
categories: "jquery"
---

# **前言**
今天主要介绍一款自己实现的滑动数值选择组件myRange.该组件可兼容PC端和移动web.

---

# **简介**

先看看效果:

<iframe src="/demo/pagesDemo/jquery_myRange.html" width="320px" height="300px"></iframe>

[完整demo](/demo/pagesDemo/jquery_myRange.html)

如果只是需要简单的使用它,则下载[js代码](/demo/pagesDemo/js/jquery.myRange.js).
使用方式也很简单:
``` javascript
    $('.j-range').myRange({
        onSlide:function(value){
            $('.j-value').html(value);
        },
        onChange:function(value){
            $('.j-finalValue').html(value);
        }
    });
```

参数列表如下:
``` javascript
    var defaults = {
        valueCls:'value',//当前有效值范围显示class
        handleCls:'handle',//滑块显示class
        min:0,//最小值
        max:100,//最大值
        value:50,//初始值
        steps:1,//每次移动变换值
        onSlide:function(){},//滑动时触发事件
        onChange:function(){}//滑动后触发事件
    };
```
---

# **原理**

如果想深入一步,该组件原理也很简单.但是却是适合jQuery入门童鞋联系编写jQuery组件的
一个好机会.

编写jQuery组件,首先需要传入参数,和默认参数合并:

``` javascript
/**
 * Created by liufang on 2016/12/6.
 */
;(function($){
    $.fn.myRange = function(options){
        var defaults = {
            valueCls:'value',//当前有效值范围显示class
            handleCls:'handle',//滑块显示class
            min:0,//最小值
            max:100,//最大值
            value:50,//初始值
            steps:1,//每次移动变换值
            onSlide:function(){},//滑动时触发事件
            onChange:function(){}//滑动后触发事件
        };
        var options = $.extend({},defaults,options);
    };
})(jQuery);
```

然后是定义各种节点,变量,公有方法和私有方法:

``` javascript
;(function($){
    $.fn.myRange = function(options){
        var defaults = {
            valueCls:'value',//当前有效值范围显示class
            handleCls:'handle',//滑块显示class
            min:0,//最小值
            max:100,//最大值
            value:50,//初始值
            steps:1,//每次移动变换值
            onSlide:function(){},//滑动时触发事件
            onChange:function(){}//滑动后触发事件
        };
        var options = $.extend({},defaults,options);
        var $window = $(window);
        var $document = $(document);
        var $body = $('body');
        return this.each(function(){
            //定义对象
            var _self = this;
            var $this = $(this);
            var $value = $("<div class='"+options.valueCls+"'></div>").appendTo($this);
            var $handle = $("<div class='"+options.handleCls+"'></div>").appendTo($this);
            //全局变量
            var _api = {};
            var _value = options.value;
            var _handle_width = $handle.width();
            var _offset = 0;
            var _width = $this.width();
            var _length = _width/(options.max - options.min);//单元宽度
            var _cursor_position = $this.offset().left;//鼠标位置
            var isMouseDown = false;
            //样式初始化
            $this.css('position','relative');
            $value.css('height','100%');
            $handle.css('position','absolute');

            //共有方法
            //移动端指定值
            _api.setValue = function(value){
                _value = value || _value;
                _value = Math.min(_value,options.max);
                _value = Math.max(_value,options.min);
                $value.css('width',(_value-options.min)*_length);
                $handle.css('left',(_value-options.min)*_length);
                //将值传入onSlide方法
                options.onSlide(_value);
            };

            //私有方法
            //控制时候可以被选中
            function setSelectable(obj, enabled) {
                if(enabled) {
                    obj.removeAttr("unselectable").removeAttr("onselectstart").css("user-select", "");
                } else {
                    obj.attr("unselectable", "on").attr("onselectstart", "return false;").css("user-select", "none");
                }
            };

            _api.setValue(_value);
        });
    };
})(jQuery);
```

接下来是核心逻辑,该组件体现于事件的绑定上,myRange组件完整代码如下:

``` javascript
/**
 * Created by liufang on 2016/12/6.
 */
;(function($){
    $.fn.myRange = function(options){
        var defaults = {
            valueCls:'value',//当前有效值范围显示class
            handleCls:'handle',//滑块显示class
            min:0,//最小值
            max:100,//最大值
            value:50,//初始值
            steps:1,//每次移动变换值
            onSlide:function(){},//滑动时触发事件
            onChange:function(){}//滑动后触发事件
        };
        var options = $.extend({},defaults,options);
        var $window = $(window);
        var $document = $(document);
        var $body = $('body');
        return this.each(function(){
            //定义对象
            var _self = this;
            var $this = $(this);
            var $value = $("<div class='"+options.valueCls+"'></div>").appendTo($this);
            var $handle = $("<div class='"+options.handleCls+"'></div>").appendTo($this);
            //全局变量
            var _api = {};
            var _value = options.value;
            var _handle_width = $handle.width();
            var _offset = 0;
            var _width = $this.width();
            var _length = _width/(options.max - options.min);//单元宽度
            var _cursor_position = $this.offset().left;//鼠标位置
            var isMouseDown = false;
            //样式初始化
            $this.css('position','relative');
            $value.css('height','100%');
            $handle.css('position','absolute');

            //共有方法
            //移动端指定值
            _api.setValue = function(value){
                _value = value || _value;
                _value = Math.min(_value,options.max);
                _value = Math.max(_value,options.min);
                $value.css('width',(_value-options.min)*_length);
                $handle.css('left',(_value-options.min)*_length);
                //将值传入onSlide方法
                options.onSlide(_value);
            };

            //私有方法
            //控制时候可以被选中
            function setSelectable(obj, enabled) {
                if(enabled) {
                    obj.removeAttr("unselectable").removeAttr("onselectstart").css("user-select", "");
                } else {
                    obj.attr("unselectable", "on").attr("onselectstart", "return false;").css("user-select", "none");
                }
            };

            //添加PC端事件绑定
            $this.on('mousedown',function(e){
                isMouseDown = true;
                _offset = $this.offset().left;
                _cursor_position = e.pageX-_offset-$handle.position().left;
                //排除选中的误差
                setSelectable($body,false);
            });
            $this.on('mouseup',function(e){
                if(!!isMouseDown){
                    isMouseDown = false;
                    setSelectable($body,true);
                    var move = e.pageX - _offset;
                    if(_cursor_position>0&&_cursor_position<_handle_width){
                        move -= _cursor_position;
                    }
                    _value = Math.round(move/(_length*options.steps))*options.steps+options.min;
                    _api.setValue();
                    options.onSlide(_value);
                    options.onChange(_value);
                }
            });
            //添加移动端事件绑定
            $this.on('touchstart',function(e) {
                isMouseDown = true;
                _offset = $this.offset().left;
                _cursor_position =e.originalEvent.changedTouches[0].pageX-_offset-$handle.position().left;
            });
            $this.on('touchmove',function(e){
                e.stopPropagation();
                e.preventDefault();
                if(isMouseDown){
                    var move = e.originalEvent.changedTouches[0].pageX - _offset;
                    if(_cursor_position>0&&_cursor_position<_handle_width){   //鼠标在手柄中位置，对值的修正
                        move -=_cursor_position;
                    }
                    move = Math.max(0,move);
                    move = Math.min(move,_width);
                    $value.css({
                        'width':move
                    });
                    $handle.css({
                        'left':move
                    });
                    _value = Math.round(move/(_length*options.steps))*options.steps+options.min;
                    options.onSlide(_value);
                }
            });
            $this.on('touchend',function(e){
                if(isMouseDown){
                    isMouseDown = false;
                    setSelectable($body,true);
                    _api.setValue();
                    options.onChange(_value);
                }
            });

            //鼠标滑出组件也可以正常使用
            $document.on('mousemove',function(e){
               if(!!isMouseDown){
                   var move = e.pageX - _offset;
                   if(_cursor_position>0&&_cursor_position<_handle_width){   //精确计算
                       move -=_cursor_position;
                   }
                   move = Math.max(0,move);
                   move = Math.min(move,_width);
                   $value.css('width',move);
                   $handle.css('left',move);
                   _value = Math.round(move/(_length*options.steps))*options.steps+options.min;
                   options.onSlide(_value);
               }
            });
            $document.on('mouseup',function(e){
                if(!!isMouseDown){
                    isMouseDown = false;
                    setSelectable($body,true);
                    _api.setValue();
                    options.onChange(_value);
                }
            });
            _api.setValue(_value);
        });
    };
})(jQuery);
```