---
title: svg入门
date: 2017-05-02 16:39:13
categories: "svg"
---

# **前言**
最近参与了学习地图的调研和开发工作，使用到了svg的绘制，故而对svg的相关知识进行整理。方便大家共同学习。

# **简介**
svg（Scalable Vector Graphics）是可缩放矢量图形的缩写，基于可扩展标记语言XML来描述二维矢量图形的一种图形格式，由W3C制定，是一个开放标准。
svg与canvas的区别：
* Canvas基于像素，提供2D绘制函数，是一种HTML元素类型，依赖于HTML，只能通过脚本来绘制图形，Canvas提供的功能比较原始，适合像素处理，动态渲染和大数据量绘制的应用场景；
* SVG为矢量，提供一系列图形元素（Rect, Path, Circle, Line …），还有完整的动画，事件机制，本身可以独立使用，也可以嵌入到HTML中，SVG很早就成为了国际标准，功能更完善，适合静态图片展示，高保真文档查看和打印的应用场景;

svg有着强大的标签系统和动画，又可以通过控制标签的样式来实现多样化，且兼容ie9+，所以较为方便。

# **坐标系**

svg中的坐标系如下：
![img](/svg入门/1.png)

我们也可以通过更为复杂的[viewbox](https://segmentfault.com/a/1190000004320934)来控制可视窗口

# **标签**

## 形状
svg中有很多标签，我们先以形状来看，常用形状如下图所示：

![img](/svg入门/2.png)

### rect矩形
```html
<rect x="20" y="20" rx="20" ry="20" width="250" height="250" style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"/>
```

1)rect 元素的 width 和 height 属性可定义矩形的高度和宽度
2)style 属性用来定义 CSS 属性
3)CSS 的 fill 属性定义矩形的填充颜色（rgb 值、颜色名或者十六进制值）
4)CSS 的 stroke-width 属性定义矩形边框的宽度
5)CSS 的 stroke 属性定义矩形边框的颜色
6)x 属性定义矩形的左侧位置（例如，x="0" 定义矩形到浏览器窗口左侧的距离是 0px）
7)y 属性定义矩形的顶端位置（例如，y="0" 定义矩形到浏览器窗口顶端的距离是 0px）
8)CSS 的 fill-opacity 属性定义填充颜色透明度（合法的范围是：0 - 1）
9)CSS 的 stroke-opacity 属性定义笔触颜色的透明度（合法的范围是：0 - 1)
10)rx 和 ry 属性可使矩形产生圆角。

### circle圆
``` html
<circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red"/>
```

1)cx 和 cy 属性定义圆点的 x 和 y 坐标。如果省略 cx 和 cy，圆的中心会被设置为 (0, 0)
2)r 属性定义圆的半径。

### ellipse椭圆
``` html
<ellipse cx="300" cy="150" rx="200" ry="80"/>
```

1)cx 属性定义圆点的 x 坐标
2)cy 属性定义圆点的 y 坐标
3)rx 属性定义水平半径
4)ry 属性定义垂直半径

### line直线
``` html
<line x1="0" y1="0" x2="300" y2="300"/>

```

1)x1 属性在 x 轴定义线条的开始
2)y1 属性在 y 轴定义线条的开始
3)x2 属性在 x 轴定义线条的结束
4)y2 属性在 y 轴定义线条的结束

### polyline折线
```html
<polyline points="0,0 0,20 20,20 20,40 40,40 40,60" />
```
1)points 属性定义每段线的每个角的 x 和 y 坐标

### polygon多边形
```html
<polygon points="220,100 300,210 170,250" style="fill:#cccccc; stroke:#000000;stroke-width:1"/>

```
1)points 属性定义多边形每个角的 x 和 y 坐标

### path路径
路径这个形状较为复杂，它有很多种表现形式。

![img](/svg入门/3.png)


## 辅助
除了形状元素外，还有一些辅助性的元素，如下：
* svg：SVG的根元素，并且可以相互嵌套；
* g：用来将SVG中的元素进行分组操作，分组后可以看成一个单独的形状，统一进行转换，同时g元素的样式可以被子元素继承，但是它没有X,Y属性，不过可以通过transform来移动它；
* def：用于定义在SVG中可重用的元素，def元素不会直接展示出来，可以通过use元素来引用；
* use：通过它来复用def元素，也包括、元素，使用即可调用；
* text：可以用它来实现word中的那种“艺术字”，很神奇的一个功能；
* image：用它可以在SVG中嵌套对应的图片，并可以在图片上和周围做对应的处理;

在复杂的svg构成的UI中，可以通过合理的组织g，来分组，提高维护性和拓展性。



# 动画
svg自带一些动画指令标签
![img](/svg入门/4.png)

也可参考[该文章](http://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/)，有很多实用的动画效果示例。

这里需要强调一点，就是动画中的begin是针对页面加载起始时间而言的。如果是自己手动调用动画，或者是事件触发后再调用，需要给animate赋予id，将其begin设置为indefinite，并通过该元素的beginElement()方法来使动画生效。
```javascript
var animate = document.querySelector('#shadeMidAnimate0');
    var path = d3.select('#shadeMidPath0');
    animate.beginElement();
    
```

当然，一般在用d3.js时也会用到一些简单动画，可以参考[这里](http://www.oxxostudio.tw/articles/201501/svg-d3-14-transition-1.html)


## 无限循环的动画
通过多个动画之间连接控制。
```html
<animateTransform begin="myanim.end" id="pause" dur="3s" type="translate" attributeType="XML" attributeName="transform"/>
         
<animateMotion id="myanim" dur="6s" begin="0; pause.end" fill="freeze">
   <mpath xlink:href="#theMotionPath"/>
</animateMotion>
```

第二个的begin位于第一个id的end之后。[demo](/demo/pagesDemo/svg_infinite_animate.html)
