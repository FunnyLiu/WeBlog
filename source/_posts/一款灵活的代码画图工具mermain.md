---
title: 一款灵活的代码画图工具mermaid
date: 2017-03-11 20:34:21
categories: "web工程"
---

# **前言**
随着前端组件化开发的流行度与日俱增,工程越来越大,业务越来越复杂.为了提高项目的可维护性,前端也需要对项目中的各个模块进行设计工作,并整理umi,时序图等.
今天就推荐一款比较灵活方便的画图工具--[mermaid](https://github.com/knsv/mermaid).

# **简单介绍**
mermaid的灵活之处在于,通过特定的语法,解析时序图或流程图为svg图片.
也就是说,日后某个迭代流程修改后,只需要修改少量代码,就可以得到全选的流程图和时序图.
而以往的一些在线画图工具,如果需要修改图片,则需要从头推翻再来,甚是耗时耗力.

其具体的语法参考[文档](http://knsv.github.io/mermaid/#mermaid)
安装可以用npm或bower:

```
bower install mermaid --save-dev
npm install mermaid --save-dev
```

使用时只需要引入对应的js,并执行`mermaid.initialize({startOnLoad:true});`即可

# **一个小demo**

这里展示一个时序图的小demo:
``` html
<script src="../lib/mermaid/dist/mermaid.min.js"></script>
<div class="mermaid">
    sequenceDiagram
    participant 用户
    participant 课时单元内容编辑模块
    participant 富文本课时组件
    participant cacherichtext as cache-richtext
    participant upload组件
    用户->>课时单元内容编辑模块:初始化
    课时单元内容编辑模块->>cacherichtext:_$getItem
    cacherichtext-->>课时单元内容编辑模块:onItemLoad
    课时单元内容编辑模块->>富文本课时组件:init
    富文本课时组件-->>用户:显示富文本课时组件
    用户->>富文本课时组件:上传附件
    富文本课时组件->>upload组件:upload
    upload组件-->>富文本课时组件:onUpload
    富文本课时组件-->>用户:onUpload
    Note over 富文本课时组件,用户: 这里是备注1
    用户->>富文本课时组件:保存
    富文本课时组件-->>课时单元内容编辑模块:$emit('save')
    课时单元内容编辑模块->>cacherichtext:_$updateItem
    cacherichtext-->>课时单元内容编辑模块:onItemUpdate
    课时单元内容编辑模块-->>用户:返回课件列表页
    Note right of upload组件: 这里是备注---2
</div>
<script>mermaid.initialize({startOnLoad:true});</script>
```

效果如下:
![img](/一款灵活的代码画图工具mermain/1.png)

是不是很震撼.