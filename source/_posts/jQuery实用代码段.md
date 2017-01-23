---
title: jQuery实用代码段
date: 2016-04-22 22:32:08
categories: "jquery"
---

# **jQuery代码段**

---

## **前言**

在开发过程中，有很多代码片段是可以进行复用的，以后在此对jQuery的有用代码段进行整理，方便日后的使用。

---

## **DOM操作相关**

### **嵌套的过滤器**

``` javascript
//允许你减少集合中的匹配元素的过滤器，
//只剩下那些与给定的选择器匹配的部分。在这种情况下，
//查询删除了任何没（:not）有（:has）
//包含class为“selected”（.selected）的子节点。
.filter(":not(:has(.selected))")
```

### **找到节点索引号**

``` javascript
$("ul > li").click(function () {
    var index = $(this).prevAll().length;
});
```

### **检测是否存在**

``` javascript 
if ($('#someDiv').length) {
//万岁！！！它存在……
}

```


---

## **动效相关**

### **滑动到页面顶部**
``` javascript 
$("a[href='#top']").click(function() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;});
```

### **滚动到某位置**

``` javascript
jQuery.fn.autoscroll = function(selector) {
    $('html,body').animate(
        {scrollTop: $(selector).offset().top},
        500
    };
}
//然后像这样来滚动到你希望去到的class/area上。
$('.area_name').autoscroll();
```

### **固定到顶部**
允许一个元素固定到顶部
``` javascript 
$(function(){
	var $win = $(window)
	var $nav = $('.mytoolbar');
	var navTop = $('.mytoolbar').length && $('.mytoolbar').offset().top;
	var isFixed=0;

	processScroll()
	$win.on('scroll', processScroll)

	function processScroll() {
	var i, scrollTop = $win.scrollTop()

	if (scrollTop >= navTop && !isFixed) { 
		isFixed = 1
		$nav.addClass('subnav-fixed')
	} else if (scrollTop <= navTop && isFixed) {
		isFixed = 0
 		$nav.removeClass('subnav-fixed')
	}}
```

### **下滑超过移动位置固定下滑隐藏**

先来一个简单版的，超过了头图区域就fixed，回到了头图就取消fixed：

``` javascript

;(function(jq, g){
    var scrollmenu = $('#scrollmenu');    
    $(window).on('scroll',function(){
        var _scrollTop = $(window).scrollTop();    
        if(_scrollTop >= 300){            
            scrollmenu.addClass('f-pf');    
        } else {              
            scrollmenu.removeClass('f-pf');     
        }
    });      
})(jQuery, window);


```



这里综合了上滑和下滑的判断，还有超过指定区域高度就固定的算法。

``` javascript
var _currentScrollTop = 0;
$(window).on('scroll',function(){
    var _scrollTop = $(window).scrollTop();
    if(_scrollTop >= _currentScrollTop){
        _currentScrollTop = _scrollTop;           
        //向下滑动
        if(!_isFixed && (_scrollTop >= _navTop)){
            _isFixed = true;       
            mainDOM._mainNavFix.addClass('f-pf');
        }                       
    } else {       
        _isFixed = false;     
        mainDOM._mainNavFix.removeClass('f-pf');    
        _currentScrollTop = _scrollTop;     
    }
});
```

### **侧边栏区域定位组件**

组件代码：
``` javascript
(function(jq,g){
	function InitSlider(){
		return this.init.apply(this,arguments);
	}  
	var template = '<div class="m-sliBox f-pa">\
    	<div class="m-sliBox-head f-pr" style="background-position-y:45px;">\
    		<div class="goto f-pa f-dn">返回主会场</div>\
    	</div>\
    	<div class="m-sliBox-body">\
    		<ul class="j-lists lists">\
    		</ul>\
    	</div>\
    	<div class="m-sliBox-foot"></div>\
    </div>';   
      
    var _pro = InitSlider.prototype;
    
   	_pro.init = function(data){
   		if(!data){
   			return;
   		}
   		var _this = this;
   		this.data = data;
   		this.offsetTop = [];
   		this.tpl=$(template);     
		this.lists = this.tpl.find('.j-lists');
		this.setLists();
   		this.show();
   		setTimeout(function(){
	   		_this.bindEvent();   			
   		},500);
   	};
   	/*根据传入的内容拼接结构*/
   	_pro.setLists = function(){
   		var _len = this.data.length;
   		var _str = '';
   		for (var i=0;i<_len;i++){
   			_str = _str + '<li data-sour="'+this.data[i].class+'">' + this.data[i].name +'</li>';
   		}
   		this.lists.append($(_str));    
   	};
   	_pro.bindEvent = function(){
   		var _len = this.data.length;
   		var _this = this;
   		/*获取各模块高度存于数组*/
    	for (var i=0;i<_len;i++){
   			this.offsetTop[i] = $('.'+this.data[i].class).offset().top;   
   		}  		    
   		this.lists.on('click','li',function(){
   			/*防止闪烁触发*/
   			$(window).off('scroll',handleScroll);
   			setTimeout(function(){
   				$(window).on('scroll',handleScroll);
   			},500);   
   			
   			var _sour = $(this).data('sour'); 
   			$('html,body').animate({  
   				scrollTop:$('.'+_sour).offset().top+20
   			},500);   
   			$(this).addClass('z-act').siblings().removeClass('z-act');      
   		}); 
   		
   		$(window).on('scroll',handleScroll);   
   		/*滑动时实时于高度数组进行比较，判断处于哪一区域*/
   		function handleScroll(){
   			var _nowOffsetTop = $(window).scrollTop();    
   			var _children = _this.lists.children();
   			for(var i=0;i<_len;i++){
   				if(_nowOffsetTop>_this.offsetTop[i]&&_nowOffsetTop<_this.offsetTop[i+1]){
   					_children.eq(i).addClass('z-act').siblings().removeClass('z-act');  
   				} 
   				if(_nowOffsetTop>_this.offsetTop[_len-1]){
   					_children.eq(_len-1).addClass('z-act').siblings().removeClass('z-act');
   				}
   			}   
   		};   
   	};
   	_pro.show = function(){   
   		$('#j-special-sliderNew').prepend(this.tpl);
   	};
   	
   	jq.showSlider = function(data){
   		return new InitSlider(data);
   	};
})(jQuery,window);

```

使用时在指定div命名class，并传参即可：

``` javascript
(function (jq, g) {
   jq(document).ready(function(jq) {
    	$.showSlider([
    		{'class':'j-live','name':'直播预告'},
  			{'class':'j-micro','name':'热门微专业'},
    		{'class':'j-design','name':'设计&产品类'},
    		{'class':'j-it','name':'技术类'},
    		{'class':'j-data','name':'数据类'},
    		{'class':'j-other','name':'其他类'}   
    	]);    				
   });
})(jQuery, window);
```

效果展示:
[demo](/demo/pagesDemo/slider.html)



### **倒计时**

``` javascript
(function(jq,g){
var timer = null;
var end;
var toZero;
var btn = document.getElementById("btn");
var oDay = $('.j-day');
var oHour = $('.j-hour');
var oMinute = $('.j-min');
var oSecond = $('.j-sec');
toZero = oDay.innerHTML = oHour.innerHTML = oMinute.innerHTML = oSecond.innerHTML = "00";
end = 1472960973980;   
  	countDown();
  	timer = setInterval(countDown, 1000);

function countDown() {　　  
    var timedate = new Date(end); //结束时间   
    var now = $.getCurServerTime();   
    //var now = new Date(1472559291702); //获取当前时间   
    //var now = new Date(); //获取当前时间
    //var date = (timedate.getTime() - now.getTime()) / 1000; //获取相差的秒数
    var date = Math.floor(end-now)/1000;   
    var day = Math.floor(date / (60 * 60 * 24));
    var _hour = date - day * 60 * 60 * 24;
    var hour = Math.floor(_hour / (60 * 60));
    var _minute = _hour - hour * 60 * 60;
    var minute = Math.floor(_minute / (60));
    var _second = _minute - minute * 60;
    var second = Math.floor(_second);

	function toDou(n) {
    	if (n < 10) {
        	return '0' + n;
	    } else {
    	    return '' + n;
    	}
		} //一位数的数字前面加0
  		if (date > 0) {  
    		oDay.html(toDou(day));
    		oHour.html(toDou(hour));
    		oMinute.html(toDou(minute));
    		oSecond.html(toDou(second));
  		} else {       
    		clearInterval(timer);
    		toZero;
  		}  
	}
})(jQuery,window);

```
  
效果如下：

![image](../jQuery实用代码段/1.png);

### **出现在屏幕中心**

``` javascript
jQuery.fn.center = function () {
    this.css('position','absolute');
    this.css('top', ( $(window).height() - this.height() ) / 2 +$(window).scrollTop() + 'px');
    this.css('left', ( $(window).width() - this.width() ) / 2 +$(window).scrollLeft() + 'px');
    return this;
}
//这样来使用上面的函数：
$(element).center();
```

### **鼠标位置**

``` javascript 
$(document).ready(function() {
    $(document).mousemove(function(e){
        $(’#XY’).html(”X Axis : ” + e.pageX + ” | Y Axis ” + e.pageY);
    });
});
```

### **一屏一屏滚动**

自己做了一个插件，原理就是利用translateY进行变换来显示不同的屏幕。
目前只是监听了鼠标滚轮事件，后期可以拓展键盘事件和移动端事件。

[demo](/demo/pagesDemo/fullpage.html)
   
插件代码：

``` javascript
;(function($,window){
    var MyFullPage = function(element,options){
        this.$element = element;
        this.defaults = {
            'parent':'scrollContainer',
            'className':'slide',
            'interval':1000,
            'startDomIndex':1
        };
        this.options = $.extend({},this.defaults,options);
        this.domLength = 0;
    };

    var pro = MyFullPage.prototype;

    pro.initFullPage = function(){
        this.setDomInfo();
        this.setDomStyle();
        this.setPageAction();
        this.bindMouseWheel(this.pageAction);
    }
    /*获取需要的节点信息*/
    pro.setDomInfo = function(){
        this.parentNode = this.$element.find('.'+this.options.parent);
        this.slideNodes = this.$element.find('.'+this.options.className);
        this.domLength = this.slideNodes.length;
        this.currentDom = this.options.startDomIndex;
    }   
    /*构造相关样式*/
    pro.setDomStyle = function(){
        var _interval = this.options.interval/1000;
        this.$element.css({
            'position':'fixed',
            'top':0,
            'right':0,
            'bottom':0,
            'left':0,
            'z-index':9999,
            'overflow':'hidden'
        });
        this.parentNode.css({
            'display':'none',
            'transition':'all ease '+_interval+'s'
        });

        this.height = this.$element.height();
        this.slideNodes.css('height',this.height+'px');
        this.parentNode.show();
    }
    /*构造动作器*/
    pro.setPageAction = function(){
        var _this = this;
        this.pageAction = {
            isScrolling:false,
            next:function(){
                if((_this.currentDom + 1)<= _this.domLength){
                    _this.currentDom +=1;
                    _this.pageAction.move(_this.currentDom);
                }
            },
            pre:function(){
                if(_this.currentDom -1 >0){
                    _this.currentDom -=1;
                    _this.pageAction.move(_this.currentDom);
                }
            },
            move:function(index){
                _this.pageAction['isScrolling'] = true;
                var di = -(index-1)*(_this.height) + 'px';
                _this.pageAction['start'] = +new Date();
                _this.parentNode.css('transform','translateY('+di+')');
                setTimeout(function(){
                    _this.pageAction['isScrolling'] = false;
                },_this.options.interval-0+10);
            }
        }
    };
    /*添加鼠标滚动事件*/
    pro.bindMouseWheel = function(page){
        var  type = 'mousewheel';
        var  deltaY = 0;
     
        function mouseWheelHandle (event) {
            if (page.isScrolling) {// 加锁部分
                return false; 
            }
            var e = event.originalEvent || event;
     
            deltaY = e.deltaY;
            if (deltaY > 0) {
                page.next();
            } else if (deltaY < 0) {
                page.pre();
            }
        }
        $(document).on('mousewheel', mouseWheelHandle);     
    }
    /*挂载jquery插件*/
    $.fn.myFullPage = function(options){
        var myFullPage = new MyFullPage(this,options);
        myFullPage.initFullPage();  
    }  
})(jQuery,window)
```

### **全局ajax等待效果**

全局ajax公用等待效果:

``` javascript
var preloader = $('<div>',{ 'class':'preloader' }).appendTo('body');
var doc = $(document);
 
// Show the preloader whenever you are making an AJAX request:
 
doc.ajaxStart(function(){
    preloader.fadeIn();
});
 
// Hide it when the ajax request finishes
 
doc.ajaxComplete(function(){
    // Keep it visible for 0.8 seconds after the request completes
    preloader.delay(800).fadeOut();
});
```


---

## **性能优化与工程处理相关**

### **预加载图片**

``` javascript 
jQuery.preloadImages = function() {
    for(var i = 0; i < arguments.length; i++) {
        $("<img />").attr('src', arguments[i]);
    }
};
//用法
$.preloadImages('image1.gif', '/path/to/image2.png', 'some/image3.jpg');
```

### **自动定位并修复图片**

``` javascript 
$('img').error(function(){
	$(this).attr('src', 'img/broken.png');});
```

### **禁用右键单击上下文菜单**

``` javascript
$(document).bind('contextmenu',function(e){
    return false;
});
```

### **鼠标右键和左键**

``` javascript 
$("#someelement").on('click', function(e) {
    if( (!$.browser.msie && e.button == 0) || ($.browser.msie && e.button == 1) ) {
        alert("Left Mouse Button Clicked");
    } else if(e.button == 2) {
        alert("Right Mouse Button Clicked");
    }
});
```

### **限制textarea字符个数**

```
jQuery.fn.maxLength = function(max){
    this.each(function(){
        var type = this.tagName.toLowerCase();
        var inputType = this.type? this.type.toLowerCase() : null;
        if(type == "input" && inputType == "text" || inputType == "password"){
            
//Apply the standard maxLength
            this.maxLength = max;
        }
        else if(type == "textarea"){
            this.onkeypress = function(e){
                var ob = e || event;
                var keyCode = ob.keyCode;
                var hasSelection = document.selection? document.selection.createRange().text.length > 0 : this.selectionStart != this.selectionEnd;
                return !(this.value.length >= max && (keyCode > 50 || keyCode == 32 || keyCode == 0 || keyCode == 13) && !ob.ctrlKey && !ob.altKey && !hasSelection);
            };
            this.onkeyup = function(){
                if(this.value.length > max){
                    this.value = this.value.substring(0,max);
                }
            };
        }
    });
};
//用法
$('#mytextarea').maxLength(500);
```

### **文本输入禁止使用空格**

``` javascript
$('input.nospace').keydown(function(e) {
	if (e.keyCode == 32) {
		return false;
	}});
```

---

## **工具函数相关**

### **遍历map格式**

有时候后端传回来的值不一定是个数组，也有可能是map格式，如下：

``` javascript
var data = {
    "key_0": [
        {
            "productId": 1002996021,
            "productName": "和秋叶一起学PPT",
            "productType": 0,
            "productCnt": null,
        },
        {
            "productId": 940019,
            "productName": "课程的名称很长会怎么样呢课程的名称很长会怎么样呢",
            "productType": 0,
            "productCnt": null,
        },
        {
            "productId": 940019,
            "productName": "课程1",
            "productType": 0,
            "productCnt": 3,
        }              
    ],
    "key_1": [   
        {
            "productId": 1002996021,
            "productName": "和秋叶一起学PPT",
            "productType": 0,
            "productCnt": null,
        },
        {
            "productId": 940019,
            "productName": "课程的名称很长会怎么样呢课程的名称很长会怎么样呢",
            "productType": 0,
            "productCnt": null,
        },
        {
            "productId": 940019,
            "productName": "课程1",
            "productType": 0,
            "productCnt": 3,
        }              
    ]         
}

```

这个时候需要用到$.map方法来对应解析：

``` javascript
$.map(data,function(val,key){
   console.log(key);
   console.log(JSON.stringify(val)); 
});

```

[demo](/demo/pagesDemo/jquery_map.html)
    


---

# **jQuery组件库**

## **jquery插件最佳书写方式**

``` javascript

;(function($, window, document,undefined) {
    //定义Beautifier的构造函数
    var Beautifier = function(ele, opt) {
        this.$element = ele,
        this.defaults = {
            'color': 'red',
            'fontSize': '12px',
            'textDecoration': 'none'
        },
        this.options = $.extend({}, this.defaults, opt)
    }
    //定义Beautifier的方法
    Beautifier.prototype = {
        beautify: function() {
            return this.$element.css({
                'color': this.options.color,
                'fontSize': this.options.fontSize,
                'textDecoration': this.options.textDecoration
            });
        }
    }
    //在插件中使用Beautifier对象
    $.fn.myPlugin = function(options) {
        //创建Beautifier的实体
        //this指向挂载的节点
        var beautifier = new Beautifier(this, options);
        //调用其方法
        return beautifier.beautify();
    }
})(jQuery, window, document);

```

---

## **myRange滑动选择数值组件**


效果:

<iframe src="/demo/pagesDemo/jquery_myRange.html" width="320px" height="300px"></iframe>

[对应介绍和下载](/2016/12/06/“jQuery滑动数值选择组件myRange”/)

---

## **myScroll滑动条组件**

效果:

<iframe src="/demo/pagesDemo/jquery_myScroll.html" width="320px" height="400px"></iframe>

[对应介绍和下载](/2016/12/07/jQuery滑动区域组件myScroll/)

---

## **myTimer倒计时组件**

[demo](/demo/pagesDemo/jquery_myTimer.html)
[js下载](/demo/pagesDemo/js/jquery.myTimer.js)
使用方式:

``` javascript
    $('.j-timer').myTimer({'endtime':1484134934000,callBack:function(){alert('结束了!')}});
```

参数列表:
``` javascript
    var defaults = {
        'starttime': '',//开始时间
        'endtime': '',//结束时间
        'callBack': function (){}//倒计时结束回调事件
    };
```

---

## **myMerry走马灯组件**

效果如下:

<iframe src="/demo/pagesDemo/jquery_myMerry.html" width="540px" height="600px"></iframe>


[demo](/demo/pagesDemo/jquery_myMerry.html)
[js下载](/demo/pagesDemo/js/jquery.myMerry.js)

参数列表:
``` javascript
    var defaults = {
        /* 节点绑定 */
        contentCls: 'content',      //轮播内容列表的class
        /* 动画相关 */
        hoverCls: 'hover',          //当鼠标移至相应区域时获得的class
        direction: 'x',             //轮播的方向
        reverse: false,             //是否反向自动播放
        immediately: false,         //悬浮是否立即停止
        delay: 0,                //开始播放前的时间间隔
        speed:1              //移动速度
    };
```

---

## **mySlider轮播图组件**

<iframe src="/demo/pagesDemo/jquery_mySlider.html" width="640px" height="800px"></iframe>

[demo](/demo/pagesDemo/jquery_mySlider.html)
[js下载](/demo/pagesDemo/js/jquery.mySlider.js)

参数列表:
``` javascript
    var defaults = {
        /* 节点绑定 */
        contentCls: 'content',      //轮播内容列表的class
        navCls: 'nav',              //轮播导航列表的class
        prevBtnCls: 'prev',         //向前一步的class
        nextBtnCls: 'next',         //向后一步的class
        /* 动画相关 */
        activeTriggerCls: 'active', //导航选中时的class
        disableBtnCls: 'disable',   //按键不可用时的class
        hoverCls: 'hover',          //当鼠标移至相应区域时获得的class
        steps: 1,                   //移动帧数,'auto'自动移动至下个没有显示完整的帧
        direction: 'x',             //轮播的方向
        reverse: false,             //是否反向自动播放
        inEndEffect: 'switch',      //"switch"表示来回切换,"cycle"表示循环,"none"表示无效果
        hasTriggers: true,          //是否含有导航触发点
        triggerCondition:'*',       //触发点的条件(有时需排除一些节点)
        triggerType: 'click',       //导航触发事件:"mouse"表鼠标移入时触发,"click"表示鼠标点击时触发
        activeIndex: 0,             //默认选中帧的索引
        pointerType: 'click',       //左右箭头的触发事件
        auto: false,                //是否自动播放
        immediately: false,         //悬浮是否立即停止
        animate: true,              //是否使用动画滑动
        delay: 3000,                //自动播放时停顿的时间间隔
        duration: 500,              //轮播的动画时长
        keyboardAble:false,         //是否允许键盘按键控制
        touchable: true,            //是否允许触碰
        sensitivity: 0.4,           //触摸屏的敏感度,滑动当前帧的百分比移动该帧，该值越小越敏感
        scrollable:false,           //是否允许滚动滚动轴时换屏
        /* 对外事件接口 */
        beforeEvent: function() {    //移动前执行,返回flase时不移动;传入一个对象,包含：index事件发生前索引,count帧长度,destination方向(prev向前,next向后,数字为相应的索引);
        },
        afterEvent: function() {     //移动后执行;传入一个对象,包含：index事件发生前索引,count帧长度
        }
    };
```