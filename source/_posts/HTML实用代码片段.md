---
title: HTML实用代码片段
date: 2016-05-02 14:44:08
categories: "html"
---

# **前言**
整理一些常用的代码片段，方便日后查询使用。

# **HTML脚手架**

``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta lang="zh">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="renderer" content="webkit">
    <meta name="description" content="">
    <meta name="keyword" content="">
    <title>DEMO</title>
    <link rel="stylesheet" href="example.css">
  </head>
  <body>
      <script src="example.js"></script>
  </body>
</html>
```

---

# **base64格式**

``` html
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=">

```

---

# **ie的注释方式**
``` html
<!--[if IE ]>
   <body class="ie">
<![endif]-->
<!--[if !IE]>-->
   <body>
<!--<![endif]-->

<!--[if IEMobile 7 ]>
  <html dir="ltr" lang="en-US"class="no-js iem7">
<![endif]-->
<!--[if lt IE 7 ]>
  <html dir="ltr" lang="en-US" class="no-js ie6 oldie">
<![endif]-->
<!--[if IE 7 ]>
  <html dir="ltr" lang="en-US" class="no-js ie7 oldie">
<![endif]-->
<!--[if IE 8 ]>
  <html dir="ltr" lang="en-US" class="no-js ie8 oldie">
<![endif]-->
<!--[if (gte IE 9)|(gt IEMobile 7)|!(IEMobile)|!(IE)]> <-->
  <html dir="ltr" lang="en-US" class="no-js">
<!--> <![endif]-->
```

---

# **ie8兼容大法**

利用斜杠9来兼容ie8，有些属性只有ie9以上才支持，比如子选择器这种：

![image](/HTML实用代码片段/222.png)



---

# **普通表单**

``` html
<form id="myForm" action="#" method="post">
  <div>
    <label for="name">姓名:</label>
    <input type="text" name="name" id="name" value="" tabindex="1">
   </div>
   <div>
     <h4>单项选择</h4>
     <label for="radio-choice-1">选项1</label>
     <input type="radio" name="radio-choice-1" id="radio-choice-1" tabindex="2" value="choice-1">
    <label for="radio-choice-2">选项2</label>
    <input type="radio" name="radio-choice-2" id="radio-choice-2" tabindex="3" value="choice-2">
  </div>
  <div>
    <label for="select-choice">下拉选择:</label>
    <select name="select-choice" id="select-choice">
      <option value="选项1">选项1</option>
      <option value="选项2">选项2</option>
      <option value="选项3">选项3</option>
    </select>
  </div>
  <div>
    <label for="textarea">文本域:</label>
    <textarea cols="40" rows="8" name="textarea" id="textarea"></textarea>
  </div>
  <div>
    <label for="checkbox">Checkbox:</label>
    <input type="checkbox" name="checkbox">
  </div>
  <div>
    <input type="submit" value="Submit">
  </div>
</form>
```
<form id="myForm" action="#" method="post">
  <div>
    <label for="name">姓名:</label>
    <input type="text" name="name" id="name" value="" tabindex="1">
   </div>
   <div>
     <div>单项选择</div>
     <label for="radio-choice-1">选项1</label>
     <input type="radio" name="radio-choice-1" id="radio-choice-1" tabindex="2" value="choice-1">
    <label for="radio-choice-2">选项2</label>
    <input type="radio" name="radio-choice-2" id="radio-choice-2" tabindex="3" value="choice-2">
  </div>
  <div>
    <label for="select-choice">下拉选择:</label>
    <select name="select-choice" id="select-choice">
      <option value="选项1">选项1</option>
      <option value="选项2">选项2</option>
      <option value="选项3">选项3</option>
    </select>
  </div>
  <div>
    <label for="textarea">文本域:</label>
    <textarea cols="40" rows="8" name="textarea" id="textarea"></textarea>
  </div>
  <div>
    <label for="checkbox">Checkbox:</label>
    <input type="checkbox" name="checkbox">
  </div>
  <div>
    <input type="submit" value="Submit">
  </div>
</form>

---

# **头图背景设置**

一种方式非常方便的控制头图，在屏幕小的时候可以自动截断两侧。

``` css
background-position:center bottom;
```

---

# **透明边框**

``` css
border: 10px solid rgba(255,255,255,.5);
background: white;
background-clip: padding-box; 

```

<p data-height="265" data-theme-id="0" data-slug-hash="mEPRmg" data-default-tab="css,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/mEPRmg/">透明边框</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

# **媒介查询，响应式写法**

![image](/HTML实用代码片段/28.png)


大于960：
``` css
@media screen and (min-width:960px){
    body{
        background:orange;
    }
}
```

大于960，小于1200：
``` css
@media screen and (min-width:960px) and (max-width:1200px){
    body{
        background:yellow;
    }
}
```

---

# **上传多个文件**

``` html
<form method="post" action="upload.php" enctype="multipart/form-data">
  <input name='uploads[]' type="file" multiple>
  <input type="submit" value="Send">
</form>
```
后端php处理方式：

``` php
foreach ($_FILES['uploads']['name'] as $filename) {
    echo '<li>' . $filename . '</li>';
}
```

---

# **viewport**

``` html
<meta name="viewport" content="width=device-width">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

width：宽度（数值 / device-width）（范围从200 到10,000，默认为980 像素）
height：高度（数值 / device-height）（范围从223 到10,000）
initial-scale：初始的缩放比例 （范围从>0 到10）
minimum-scale：允许用户缩放到的最小比例
maximum-scale：允许用户缩放到的最大比例
user-scalable：用户是否可以手动缩 (no,yes)
minimal-ui：可以在页面加载时最小化上下状态栏。（已弃用）

---

# **自动选中文本**
``` html
<textarea rows="10" cols="50" onclick="this.focus();this.select()" readonly="readonly">
   example text
</textarea>
```

<p data-height="266" data-theme-id="0" data-slug-hash="jqQGdZ" data-default-tab="html,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/jqQGdZ/">自动选中文本</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

# **单行文本过长注释**

通过宽度来截取：

``` html
div.test
{
    white-space:nowrap; 
    width:12em; 
    overflow:hidden; 
    text-overflow:ellipsis;
}

```

---

# **多行文本过长注释**

``` css
overflow: hidden;
text-overflow: ellipsis;
display: box;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
```

---

# **水平居中**

子容器和父容器宽度均不固定。

## **水平居中1**

![image](/HTML实用代码片段/1.png)
优点，兼容性好，配置display:inline;zoom:1;可以兼容ie6。
缺点，text-align，导致内部文字被迫居中。


## **水平居中2**

![image](/HTML实用代码片段/2.png)

通过display:table，将div宽度自适应。


## **水平居中3**

![image](/HTML实用代码片段/3.png)

通过translate来实现居中。
优点：绝对定位脱离文档流，不会影响其他。
缺点：css3属性，不兼容ie8.


## **水平居中4**

![image](/HTML实用代码片段/4.png)

通过flex来实现居中。
缺点：css3属性，不兼容ie8.

---

# **垂直居中**

子容器和父容器高度都不用固定。

## **垂直居中1**

![image](/HTML实用代码片段/5.png)

兼容性比较好，ie8。


## **垂直居中2**


![image](/HTML实用代码片段/6.png)

利用translate来居中。


## **垂直居中3**

![image](/HTML实用代码片段/7.png)

---

# **水平垂直居中**

子容器和父容器高度宽度都不确定的情况下。

## **水平垂直居中1**

![image](/HTML实用代码片段/8.png)

兼容性好。

## **水平垂直居中2**

![image](/HTML实用代码片段/9.png)

不影响其他元素，但兼容性不好。

## **水平垂直居中3**

![image](/HTML实用代码片段/10.png)


---

# **多列布局**

## **定宽与自适应**

一列定宽，一列自适应。

方案1：

![image](/HTML实用代码片段/11.png)

优点是容易理解。
缺点是由于右边不是浮动的，所以如果其中有清除浮动，就出现问题。

方案2：

![image](/HTML实用代码片段/12.png)

通过右侧触发bfc来解决。

方案3：

![image](/HTML实用代码片段/13.png)

table-layout可以提高渲染速度。

方案4：

![image](/HTML实用代码片段/14.png)

两列定宽，一列自适应。

和一列定宽是类似的：

![image](/HTML实用代码片段/15.png)

## **不定宽与自适应**

不定宽是指**宽度由内部元素撑起来**。

方案1：

主流方式。

![image](/HTML实用代码片段/16.png)

方案2：

![image](/HTML实用代码片段/17.png)

其中的0.1%是为了避免1px在ie8下的bug。

方案3：

![image](/HTML实用代码片段/18.png)

flex万能大法，但是兼容行不行。

两列不定宽一列自适应是一个道理：

![image](/HTML实用代码片段/19.png)

## **等宽**

每一列中的宽度一样，每一列的间距一样。

方案1：

![image](/HTML实用代码片段/20.png)

box-sizing:border-box是为了让宽度包含padding，父亲的margin-left需要和间距一致。

方案2：

![image](/HTML实用代码片段/21.png)

优点是结构和样式解耦了，中间无论多少列都是等宽。
缺点是多了一些结构代码。

方案3：

![image](/HTML实用代码片段/22.png)

这里的.column+.column选择的是第一列之外的后面几列。

## **等高**

左列变高后，右列对应也要变高，我们需要两列是等高的。

方案1：

![image](/HTML实用代码片段/23.png)

方案2：

![image](/HTML实用代码片段/24.png)

方案3：

![image](/HTML实用代码片段/25.png)

这种属于伪等高。

# **全屏布局**

后台系统的标准配置，上左下区域固定宽高，右部自适应。

方案1:

![image](/HTML实用代码片段/26.png)

方案2：

![image](/HTML实用代码片段/27.png)


---

# **flex布局兼容性写法**

腾讯ISUX团队整理的flex兼容性写法：
``` html
.flex-cont {
    display: -webkit-box;
    display: -webkit-flex;
    display:flex;
    /*水平居中*/
    -webkit-box-pack:center;
    -webkit-justify-content:center;
    justify-content:center;
    /*垂直居中*/
    -webkit-box-align:center;
    -webkit-align-items:center;
    align-items:center;
}
.flex-item {
    -webkit-box-flex:1;
    -webkit-flex:1;
    flex:1
}
```

其实flex最大的坑恰恰来自于微信....

---

# **多行文字或单行文字均水平垂直居中**

``` html

<style type="text/css">
.parent {
    float: left;
    margin-right:20px;
    width: 200px;
    height: 100px;
    background-color: red;
}
.children {
    position: relative;
    left: 50%;
    top:50%;
    width:150px;
    -webkit-transform : translate3d(-50%, -50%, 0);
    transform : translate3d(-50%, -50%, 0);
    background-color: black;
    color:white;
}
</style>
<div class="parent">
    <div class="children">
        <div class="children_inline">一行文字水平垂直居中噢！</div>
    </div>
</div>

<div class="parent">
    <div class="children">
        <div class="children_inline">多行文字水平垂直居中噢！</div>
        <div class="children_inline">多行文字水平垂直居中噢！</div>
    </div>
</div>


```

相对有效，当遇到多行文本且是不同状态下不同dom结构时都能保持水平垂直居中。

[demo](/demo/pagesDemo/css_multiCenter.html)

---

# **移动端点击后不再出现透明框**

移动端开发时，可以点击的位置点击后经常出现高亮框：

![images](HTML实用代码片段/2016051601.gif)

可以通过以下方式取消高亮框：

``` css
/*取消透明框*/
.none{
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}
/*指定颜色框*/
.have{
    -webkit-tap-highlight-color:rgba(255,0,0,1);
}

```
---


# **User Agent模拟**

在PC浏览器中模拟各种环境情况。

微信：

```
Mozilla/5.0 (Linux; Android 4.4.4; HM NOTE 1LTEW Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 MicroMessenger/6.0.0.54_r849063.501 NetType/WIFI
```

关键字是MicroMessenger