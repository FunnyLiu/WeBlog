---
title: jQuery滑动区域组件myScroll
date: 2016-12-07 14:26:40
categories: "jquery"
---

# **前言**
今天主要介绍一个兼容PC和移动Web的滑动区域组件myScroll.之前在[一篇文章](/2016/06/06/移动端滑动iscroll使用实践/)中介绍过
iscroll,其功能虽然很强大,但是文件大小不小,而且需要一定的学习成本.而很多情况,我们
只是需要很简单的较为流畅的滑动体验即可.

---

# **简介**
先看看效果:

<iframe src="/demo/pagesDemo/jquery_myScroll.html" width="320px" height="400px"></iframe>

[完整demo](/demo/pagesDemo/jquery_myScroll.html)

如果只是需要简单的使用它,则下载[js代码](/demo/pagesDemo/js/jquery.myScroll.js).

使用方式也很简单:
``` javascript
    $('.j-scroll').myScroll();
```

参数列表如下:
``` javascript
    var defaults = {
        contentCls:'content',//内容区class
        trackCls:'track',//滑块的class
        direction:'y',//滚动条的方向,y或者x
        steps:50,//滚动鼠标中轴的单位
        touchable:true,//是否允许触摸操作
        slide:0//默认移动的距离
    };
```

demo中的纵向滑动和横向滑动html结构是一样的:

``` html
<div class="u-scroll j-scroll">
    <div class="box">
        <ul class="content">
            <li>数据1</li>
            <li>数据2</li>
            <li>数据3</li>
            <li>数据4</li>
            <li>数据5</li>
            <li>数据6</li>
            <li>数据7</li>
            <li>数据8</li>
            <li>数据9</li>
            <li>数据10</li>
            <li>数据11</li>
            <li>数据12</li>
            <li>数据13</li>
            <li>数据14</li>
        </ul>
    </div>
    <div class="track">
        <div class="thumb"></div>
    </div>
</div>
```

只不过样式不同,scss:
``` scss
.u-scroll {
    width:200px;
    .box {
        width:200px;
        height:200px;
        .content {
            width:100%;
            li {
                height:30px;
                line-height:30px;
                text-align: center;
                &:nth-of-type(2n+1) {
                    background:#00B7FF;
                }
            }
        }
    }
    .track {
        top:0;
        right:0;
        height:100%;
        width:5px;
        background:#e3e3e3;
        .thumb {
            position:relative;
            background: #00fefe;;
        }
    }
}
.u-scrollX {
    width:300px;
    .box {
        width:300px;
        height:100px;
        .content {
            height:100%;
            li {
                float:left;
                display:inline-block;
                width:80px;
                height:100px;
                line-height:100px;
                text-align:center;
                &:nth-of-type(2n+1){
                    background: #00b7ff;
                }
            }
        }
    }
    .track {
        left:0;
        bottom:0;
        width:100%;
        height:5px;
        background:#e3e3e3;
        .thumb {
            height:5px;
            position:relative;
            background:#00fefe;
        }
    }
}
```

---

# **原理**

插件完整代码如下:

``` javascript
/**
 * Created by liufang on 2016/12/7.
 */
;(function($){
    $.fn.myScroll = function(options){
        var defaults = {
            contentCls:'content',//内容区class
            trackCls:'track',//滑块的class
            direction:'y',//滚动条的方向,y或者x
            steps:50,//滚动鼠标中轴的单位
            touchable:true,//是否允许触摸操作
            slide:0//默认移动的距离
        };
        var options = $.extend({},defaults,options);
        var $document = $(document);
        var $body = $('body');
        return this.each(function(){
            //定义对象
            var $this = $(this);
            var $content = $this.find('.'+options.contentCls);
            var $track = $this.find('.'+options.trackCls);
            var $thumb = $track.children();
            //全局变量
            var _api = {};
            var _track_offset = 0;
            var _content_position = 0;
            var _cursor_position = 0;
            var _start = {};
            var isMouseDown = false;
            var _track_length,_content_length,_box_length,_thumb_length,_distance,_room;
            //样式初始化
            $this.css({'position':'relative','overflow':'hidden'});
            $content.css('position','absolute');
            $track.css('position','absolute');

            //共有方法
            //移动到指定值
            _api.setValue = function(value){
                if(value>_room){
                    value = _room;
                }else if(value<0){
                    value = 0;
                }
                if(_room>=0){
                    $thumb.css(options.direction=='y'?'top':'left',value*_api.ratio+'px');
                    $content.css(options.direction=='y'?'top':'left',-value+'px');
                }
            };
            //初始化
            _api.init = function(){
                if(options.direction=='x'){
                    var width = 0;
                    $content.children().each(function(){
                        var $this = $(this);
                        $this.removeAttr('style').css('width',$this.width()+'px');
                        width += $this.outerWidth(true);
                    });
                    $content.css('width',width+'px');
                }
                $track.show();
                _track_length = options.direction=='y'?$track.height():$track.width();//滑动栏长度
                _content_length = options.direction=='y'?$content.height():$content.width();//内容区总长度
                _box_length = options.direction=='y'?$this.height():$this.width();//容器长度
                _thumb_length = _box_length/_content_length*_track_length;//计算出滑块长度
                _distance = Math.max(_track_length-_thumb_length,0);//滑块距离底部的距离
                _room = Math.max(_content_length-_box_length,0);//内容区多出容器的长度
                //根据长度判断是否出现滑动栏
                if(_content_length>_box_length){
                    $thumb.css(options.direction=='y'?'height':'width',_thumb_length+'px');
                }else {
                    $track.hide();
                }
                _api.ratio = _distance+_room?_distance/_room:0;//获取可滑动区和多余内容区的比例
            }

            //私有方法
            //控制是否可以被选中
            function setSelectable(obj, enabled) {
                if(enabled) {
                    obj.removeAttr("unselectable").removeAttr("onselectstart").css("user-select", "");
                } else {
                    obj.attr("unselectable", "on").attr("onselectstart", "return false;").css("user-select", "none");
                }
            };

            //添加PC端事件绑定
            $track.on('mousedown',function(e){
                isMouseDown = true;
                _track_offset = options.direction=='y'?$track.offset().top:$track.offset().left;
                _cursor_position = options.direction=='y'? e.pageY-_track_offset-$thumb.position().top: e.pageX-_track_offset-$thumb.position().left;
                //排除选中的误差
                setSelectable($body,false);
            });
            $track.on('mouseup',function(e){
                if(!!isMouseDown){
                    isMouseDown = false;
                    setSelectable($body,true);
                    var move = options.direction=='y'? e.pageY - _track_offset: e.pageX-_track_offset;
                    if(_cursor_position>0&&_cursor_position<_thumb_length){
                        move -= _cursor_position;
                    }
                    _api.setValue(move/_api.ratio);
                }
            });
            //鼠标滑轮事件
            $this.on('mousewheel',function(e){
                if($track.css('display')!='none'){
                    var delta = -e.originalEvent.wheelDelta/120|| e.originalEvent.detail/3;
                    var move = options.direction=="y"?-$content.position().top+delta*options.steps:-$content.position().left+delta*options.steps;
                    if(move>_room){
                        move = _room;
                        e.preventDefault();
                        e.stopPropagation();
                    }else if(move<0){
                        move = 0;
                        e.preventDefault();
                        e.stopPropagation();
                    }else{
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    _api.setValue(move);
                }
            });
            //如果设置了移动端可用
            if(!!options.touchable){
                //添加移动端事件绑定
                $this.on('touchstart',function(e) {
                    e.stopPropagation();
                    _start = {
                        pageX: e.originalEvent.changedTouches[0].pageX,
                        pageY: e.originalEvent.changedTouches[0].pageY
                    };
                    if(options.direction=="y"){
                        _content_position = -$content.position().top||0;
                    }else{
                        _content_position = -$content.position().left||0;
                    }
                });
                $this.on('touchmove',function(e){
                    e.stopPropagation();
                    var current = {
                        pageX: e.originalEvent.changedTouches[0].pageX,
                        pageY: e.originalEvent.changedTouches[0].pageY
                    };
                    var move = options.direction=="x"?_start.pageX - current.pageX:_start.pageY - current.pageY;//移动距离触发点的距离
                    if (options.direction=="x"&&Math.abs(current.pageY - _start.pageY) < Math.abs(move)||options.direction=="y") {  //chrome移动版下，默认事件与自定义事件的冲突
                        move +=_content_position;
                        e.preventDefault();
                        if(move<0){
                            move = 0;
                        }else if(move>_room){
                            move = _room;
                        }
                        if(_distance>0){
                            $thumb.css(options.direction=="y"?'top':'left', move*_api.ratio + "px");
                            $content.css(options.direction=="y"?'top':'left',  - move  + "px");
                        }
                    }
                });
                $this.on('touchend',function(e){
                    e.stopPropagation();
                });
            }

            //鼠标滑出组件也可以正常使用
            $document.on('mousemove',function(e){
                if(!!isMouseDown){
                    var move = options.direction=="y"?e.pageY - _track_offset:e.pageX - _track_offset;
                    if(_cursor_position>0&&_cursor_position<_thumb_length){
                        move-=_cursor_position;
                    }
                    _api.setValue(move/_api.ratio);
                }
            });
            $document.on('mouseup',function(e){
                isMouseDown = false;
                setSelectable($body,true);
                _cursor_position = 0;
            });
            //初始化
            _api.init();
            _api.setValue(options.slide);
        });
    };
})(jQuery);
```