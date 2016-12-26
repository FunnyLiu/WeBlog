---
title: 状态模式与开发实践
date: 2016-06-04 20:07:24
categories: "设计模式与开发实践"
---

# **前言**
老是通过状态变量来判断，很麻烦，通过状态机可以解决问题。

---

# **状态模式**

状态模式的定义是，**允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。**

---

# **一个简单的栗子**

这里说一个简单的场景，一个电灯，默认是关闭的，点击后会打开，再次点击会关闭。
我们可以会这样实现：

``` javascript
var _state = 'off';
_$dom.onclick = function(){
    if(_state == 'off'){
        console.log('开灯');
        _state = 'on';
    }else if(_state == 'on'){
        console.log('关灯');
        _state = 'off';
    }
};

```

如果这里状态变得复杂，比如多出了弱光，强光灯中间状态，代码的逻辑就会变得非常复杂。而且**状态的切换非常不明显**，拓展的时候必须读完onclick中的所有代码才能进行维护。

我们使用状态模式来优化一下电灯的问题：

``` javascript
var Light = function(){
    this.currState = FSM.off;//设置当前状态
    this.button = null;
}
Light.prototype.init = function(){
    var button = docuemnt.getElementById('j-btn');
    var self = this;
    this.button.onclick = function(){
        self.currState.buttonWasPressed.call(self);//将请求来源传递给状态机
    }
}
/*状态机跑起来*/
var FSM = {
    off:{
        buttonWasPressed:function(){
            //开灯相关处理
            this.currState = FSM.on;
        }
    },
    on: {
        buttonWasPressed:function(){
	        //关灯相关处理
	        this.currState = FSM.off;
        }
    }
}

var light = new Light();
light.init();
```

这样维护性就变得更强，状态的变化也显得更加明确。
状态机的关键在于FSM对象。来看一个稍微复杂点的状态机：

``` javascript
var FSM = {
    walk:{
        attack:function(){
            //todo
        },
        defense:function(){
            //todo
        }
    },
    attack:{
        walk:function(){
            //todo
        },
        defense:function(){
            //todo
        }
    }
}
```

---

# **小结**

通过状态模式来重构代码，很多杂乱无章的代码会变得清晰。