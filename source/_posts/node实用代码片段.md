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

---

# **复制小文件**
```javascript
var fs = require('fs');

function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}

function main(argv) {
    copy(argv[0], argv[1]);
}

main(process.argv.slice(2));
```
process是一个全局变量，可通过process.argv获得命令行参数。由于argv[0]固定等于NodeJS执行程序的绝对路径，argv[1]固定等于主模块的绝对路径，因此第一个命令行参数从argv[2]这个位置开始。

# **复制大文件**
上面的方式是一次性将所有的文件内容都读取到内存中，再一次性写入磁盘的方式。这种方式不适合拷贝大文件，对于大文件，我们只能读一点写一点。

```javascript

var fs = require('fs');

function copy(src, dst) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function main(argv) {
    copy(argv[0], argv[1]);
}

main(process.argv.slice(2));

```
以流的形式来操作文件的读写，用pipe方法把两个数据流连接起来。

# **遍历目录结构**
简单地实现以下目录遍历函数
```javascript

function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}
```

如果遇到目录，就接着往下遍历。如果遇到文件，就将其绝对路径作为参数传入回调函数。
假设有以下目录：
```shell
- /home/user/
    - foo/
        x.js
    - bar/
        y.js
    z.css
```

使用以下代码遍历该目录时，得到的输入如下。
```javascript

travel('/home/user', function (pathname) {
    console.log(pathname);
});

// /home/user/foo/x.js
// /home/user/bar/y.js
// /home/user/z.css

```

再来个异步API的版本：
```javascript
function travel(dir, callback, finish) {
    fs.readdir(dir, function (err, files) {
        (function next(i) {
            if (i < files.length) {
                var pathname = path.join(dir, files[i]);

                fs.stat(pathname, function (err, stats) {
                    if (stats.isDirectory()) {
                        travel(pathname, callback, function () {
                            next(i + 1);
                        });
                    } else {
                        callback(pathname, function () {
                            next(i + 1);
                        });
                    }
                });
            } else {
                finish && finish();
            }
        }(0));
    });
}
```

# **promise**
接口一个接一个。。
```javascript
this.getOneSpecial(specialName)
.then(function (data) {
    callback(0.1,'已经获取到专题'+specialName+'的内容,为：\n'+JSON.stringify(data||{},null,4));
    templateDataListItems = data.templateDataListItems;

    _.forEach(data.templateDataListItems, function (item) {
        di.push({"name": item.dataInstanceName});
        mt.push({"name": item.moduleTemplateName});
    });

    that.publishFtl = data.publishFtl||'';

    callback(0.15,'获取模块相关信息...');

    return that.getModuleInstance(mt);
}).then(function (data) {
    moduleTemplates=data;

    callback(0.2,'已经获取到专题'+specialName+'中模板实例的模板数据为：\n'+JSON.stringify(data||{},null,4));

    return that.getModuleDataInstance(di);
}).then(function (data) {

    callback(0.25,'已经获取到专题'+specialName+'中模板实例的数据实例数据为：\n'+JSON.stringify(data||{},null,4));

    dataInstanceNames = data;
    that.generatePageData(templateDataListItems, moduleTemplates, dataInstanceNames,callback);


})
```