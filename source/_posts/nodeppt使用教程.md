---
title: nodeppt使用教程
date: 2016-10-13 12:28:02
categories: "node"
---

# **前言**

有时候，需要做一些分享，或者说类似PPT的东西。想与众不同或者说在线版。可以考虑使用[nodeppt](https://github.com/ksky521/nodePPT)这款工具。
这里简单说下它的使用方法。

---

# **安装**

npm安装
```
npm install -g nodeppt
```
---

# **编写**

在指定文件目录下
```
nodeppt start
```
通过markdown语法编写，完成后再通过命令行转化为html页面，从而实现在线化。
markdown语法的demo：[demo](http://qdemo.sinaapp.com/)
该demo中具体markdown语法： [语法](http://brizer.top/demo/ppts/demo.md)

---

# **生成**

markdown文件编写完成后，需要命令行转化为html：

```
# 默认导出在publish文件夹
nodeppt generate demo.md -a
```

最后生成的publish文件夹中就有html文件。





