---
title: Regular组件通信方式汇总
date: 2017-04-26 11:49:52
categories: "Regular"
---

# **前言**
近期，使用数据驱动型框架Regular进行了几个迭代的开发任务。针对组件化开发方式中，组件的通信方式和用法进行整理。

# **双向绑定**
Regular本身就带有数据双向绑定功能，所以如果需要同级或父子级组件实现数据共享，通过将属性绑定到各个组件即可。
比如说live、courseList、imgList等组件内容根据tab的curIndex变化,主需要四个组件都赋予curIndex属性，即可实现方向绑定。
``` html
    <ux-nav curIndex={curIndex} navList={navList} on-select={this.$refs.live.changeData(liveList[$event.index])}></ux-nav>
    <ux-live ref="live" curIndex={curIndex} live={liveList[curIndex]}></ux-live>
    <ux-mainTeach mainTea={mainteachList[curIndex]}></ux-mainTeach>
    <ux-courseList courseList={courseList} mainTea={mainteachList[curIndex]} navList={navList} curIndex={curIndex}></ux-courseList>
    <ux-imgList imgList={imgList} navList={navList} curIndex={curIndex}></ux-imgList>
```

# **对外抛出事件**
在组件内部一般性事件操作的同时，向组件外部抛出事件，方便外部调用方进行后续的逻辑处理：
``` javascript
this.$emit('select', {
    sender: this,
    selected: this.data.selected,
    parent: parent
});
```

这样一来，外部只需要通过$on监听，或者于模板中监听即可获得组件内部属性和数据：
``` html
<select2 source={source}
    on-toggle={console.log('on-toggle:', '$event.open:', $event.open)}
    on-select={console.log('on-select:', '$event.selected:', $event.selected)}
    on-change={console.log('on-change:', '$event:', $event)} />
```

# **父组件挂载**
Regular中，父亲组件的属性会挂载于子组件的$parent上，这样可以轻松实现子组件访问父组件的属性，和递归组件获取属性的情况。

![img](/Regular组件通信方式汇总/1.png)

![img](/Regular组件通信方式汇总/2.png)

# **store发布订阅模式**
当组件的结构变得复杂，嵌套多层，而我们又需要跨层级组件通讯时，如果一层层的将数据传递进去，就会显得额外笨重。
这时，我们可以简单维护一个发布订阅对象store，来统一维护整个UI的跨层级数据传输，[demo](/demo/pagesDemo/regular_store.html)

核心如下：
``` javascript
//自定义store，进行处理
var store = new Regular();
store.dispatch = function(action){
    var state = this.data;
    switch(action.type){
        case 'CHANGE_D':
            state.blog = action.payload;
            break;
    }
    store.$emit('change',this.data);
};
store.subscribe = function(listener){
    this.$on('change',listener);
};
```

在数据改动时，通过type指定不同的action：
```javascript
var a = Regular.extend({
    template: '#a',
    name:'ux-a',
    changeData:function(){
        //通过改变数据的方式来触发嵌套子组件的修改
        this.data.blog.b.d =  '来个随机数'+Math.random();
        this.$update();
        //通过发布，跨组件修改
        store.dispatch({
            type:'CHANGE_D',
            payload:'这里是修改后的ddd'+Math.random()
        });
}
});
```

而订阅者组件，通过订阅更改即可成功改变数据：
```javascript
var d = Regular.extend({
    template: '#d',
    name:'ux-d',
    config:function(){
        var _that = this;
        //通过订阅，跨组件通信
        store.subscribe(function(){
            _that.data.anotherBlog = store.data.blog;
        });
    }
});

```


如果业务场景更为复杂，或者是拓展性维护性需求更高，就要用到redux等成熟性的框架了，这点待日后笔者实践后再另行补充。

