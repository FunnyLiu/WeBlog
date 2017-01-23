---
title: javascript实用代码片段
date: 2016-05-02 20:55:10
categories: "javascript"
---

# **前言**

收集有用的javascript相关代码片段，方便日后使用。

---

# **元素是否位于当前视窗**

``` javascript
function isInViewport(el) {
    var rect = el.getBoundingClientRect();

    return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document. documentElement.clientWidth) &&
        rect.top < (window.innerHeight || document. documentElement.clientHeight);
}

```

---

# **转义**

``` javascript
function htmlEntities(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}
```

---

# **按字节截取字符串**

``` javascript
function subSt(str, len){
  var newLength = 0;
  var newStr = "";
  var chineseRegex = /[^\x00-\xff]/g;
  var singleChar = "";
  var strLength = str.replace(chineseRegex,"**").length;
  for(var i = 0;i < strLength;i++) {
      singleChar = str.charAt(i).toString();
      if(singleChar.match(chineseRegex) != null) {
          newLength += 2;
      } else  {
          newLength++;
      }
      if(newLength > len) {
          break;
      }
      newStr += singleChar;
  }
  return newStr;
}
```

<p data-height="266" data-theme-id="0" data-slug-hash="EKOwBz" data-default-tab="js,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/EKOwBz/">按字节截取字符串</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

# **删除数组中指定值的项**

``` javascript
/*获取index*/
function indexOfArray (val,arr){
    for (var i=0,len = arr.length;i<len;i++){
        if(arr[i] == val) return i;
    }
    return -1;
}
/*删除节点*/
function removeFromArray(val,arr){   
    var _index = indexOfArray(val,arr);
    if(_index >-1){
        arr.splice(_index,1);
    }
    return arr;
}; 

```
---
# **for循环简写**

``` javascript
var array = [1,2,3,4,5];
for(var i=0,c;c=array[i++];){
    document.write(c);//1,2,3,4,5
}
```
---

# **生成随机字母数字字符串**

36进制是指26个字符加10个数字

``` javascript
function generateRandomAlphaNum(len) {
    var rdmString = "";
    for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
    return  rdmString.substr(0, len);
}
```

---


# **获取图片宽高**

两种方法都可以

``` javascript
<div>
    <img id="j-img" src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png" alt="">
</div>

<script>
var img = document.getElementById('j-img');
//ie9以上
var _height = img.naturalHeight;
var _width = img.naturalWidth;
console.log('高度:'+_height+',宽度'+_width);//高度:38,宽度117

//兼容ie9以下
var imgObj = new Image();
imgObj.src = 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png';
img.onload = function(){
    console.log('高度:'+this.height+',宽度'+this.width);//高度:38,宽度117
}

</script>
```

---

# **构造函数**

定义在构造函数内部的方法和定义在原型上的方法是有区别的。
**定义在构造函数内部的方法,会在它的每一个实例上都克隆这个方法;定义在构造函数的prototype属性上的方法会让它的所有示例都共享这个方法,但是不会在每个实例的内部重新定义这个方法. 如果我们的应用需要创建很多新的对象,并且这些对象还有许多的方法,为了节省内存,我们建议把这些方法都定义在构造函数的prototype属性上。**

私有变量也是如此:
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

---

# **面向模块**

通过命名规范区分私有和公有。

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
_&&myModule.getCounter(); 


```


---

# **单例模式**

``` javascript
var getSingle = function(fn){
  var result;
  return function(){
    return result || (result = fn.apply(this,arguments));
  }
};

```
使用：

``` javascript
var createDiv = function(){
  var div = document.createElement('div');
  div.innerHTML= "i am div";
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
};
var createSingleDiv = getSingle(createDiv);

btn.onclick = function(){
  var div = createSingleDiv();
  div.style.display = 'block';
}
```

---

# **获取url中参数构建对象**

``` javascript
    var getUrlSearchObj = function(){
        var _search = window.location.search;
        if(_search.length > 1){
            //用来保存的对象
            var _objs = {};
            _search = _search.substring(1);
            var items = [];
            items = _search.split('&');
            for(var i=0,len=items.length;i<len;i++){
                var _item = items[i].split('=');
                var _name = decodeURIComponent(_item[0]);
                var _value = decodeURIComponent(_item[1]);
                _objs[_name] = _value;
            }
            return _objs;
        }   
    }  
    var objs = getUrlSearchObj();
    //http://localhost:4000/demo/getUrlSearchObj.html?a=123&b=456#hashisme
    document.write(JSON.stringify(objs));//{"a":"123","b":"456"}
```

查看例子：[demo](/demo/pagesDemo/jquery_url.html?page=12&num=3#main)


---


# **trim**

删除两侧的空格

``` javascript
  p._$trim =function(str){
       return (str || '').replace(/(^\s*)|(\s*$)/g, "");
  }
```

---

# **打开文件地址下载**

有时候需要通过js打开一个文件存放路径的url。这个时候如果用window.open的话有可能会出现浏览器拦截的问题，所以最后统一用window.location.href。这里不需要担心当前页面会被取代。因为指向的文件类型浏览器无法解析。

但是需要注意pdf文件例外。

---

# **移动端动态计算rem**

网易考拉海购方案


``` javascript

(function(win) {
    var remCalc = {};
    var docEl = win.document.documentElement,
        tid;
    /*根据设备屏幕计算rem*/
    function refreshRem() {

        var width = docEl.getBoundingClientRect().width;
        /*浏览器打开，已最大模式呈现*/
        if (width > 640) { width = 640 }
 
        var rem = width /640 * 100;
        docEl.style.fontSize = rem + "px";
        remCalc.rem = rem;
        /*解决误差*/
        var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
        if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
            var remScaled = rem * rem / actualSize;
            docEl.style.fontSize = remScaled + "px"
        }
    }

    /*节流*/
    function dbcRefresh() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 100)
    }

    win.addEventListener("resize", function() { dbcRefresh() }, false);
    /*返回上一页到达该页后激活计算*/
    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { dbcRefresh() }
    }, false);
    refreshRem();
    remCalc.refreshRem = refreshRem;
    /*转换方法，方便工程其他位置临时判断*/
    remCalc.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === "string" && d.match(/rem$/)) { val += "px" }
        return val
    };
    remCalc.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === "string" && d.match(/px$/)) { val += "rem" }
        return val
    };
    win.remCalc = remCalc
})(window);


```



---

# **动画正弦曲线**

<p data-height="265" data-theme-id="0" data-slug-hash="NrWZYB" data-default-tab="html,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/NrWZYB/">js动画正弦曲线</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

# **动画平移**

<p data-height="265" data-theme-id="0" data-slug-hash="LZYKmR" data-default-tab="html,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/LZYKmR/">js动画平移</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

# **动画抛物线**

<p data-height="265" data-theme-id="0" data-slug-hash="gMONzo" data-default-tab="html,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/gMONzo/">js动画抛物线</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

# **动画圆周运动**

<p data-height="265" data-theme-id="0" data-slug-hash="jrOjxX" data-default-tab="html,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/jrOjxX/">js动画圆周运动</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

# **动画矩形运动**

<p data-height="265" data-theme-id="0" data-slug-hash="ezYwPO" data-default-tab="html,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/ezYwPO/">js动画矩形运动</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

# **动画弹动的小球**

<p data-height="265" data-theme-id="0" data-slug-hash="BzagqV" data-default-tab="html,result" data-user="brizer" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/brizer/pen/BzagqV/">js动画弹动的小球</a> by 刘放 (<a href="http://codepen.io/brizer">@brizer</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---