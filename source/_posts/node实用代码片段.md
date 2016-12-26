---
title: node实用代码片段
date: 2016-06-12 10:24:01
categories: "node"
---

# **前言**

node这么火，怎么能不看。我们的专题内容发布系统就是基于node构建的。特此整理node实用代码片段，方便日后使用。

---

# **复制文件目录到另一目录**

利用gulp，可以看[API文档](https://github.com/gulpjs/gulp/blob/master/docs/API.md)

``` javascript
var gulp = require('gulp');
gulp.src(tempPath).pipe(gulp.dest(APP_PATH));
```

将tempPath目录中内容以文件流的方式通过**管道pipe**传输到dest中指定文件夹目录APP_PATH。可以理解为**复制粘贴**。

