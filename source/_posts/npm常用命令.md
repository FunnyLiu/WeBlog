---
title: npm相关总结
date: 2016-11-11 13:26:51
categories: "node"
---

# **前言**

最近一直在忙着毕业论文的事情，没有什么机会对技术进行沉淀和总结。所以想把自己的demo项目通过gulp跑起来，通过scss自编译为css来提高开发效率。主要还是自己太懒，在公司习惯了scss后就不想再写css了。
主要会整理一下搭建npm、gulp、gulp-sass的一些思路,本文主要针对npm。

---

# **npm常用命令**

npm的介绍不再多言，node自带的包管理器。[这篇文章介绍的很好](http://www.cnblogs.com/PeunZhang/p/5553574.html#npm-package.json)

## npm install 
安装某个包或模块。
### 默认安装最新版本
```
npm install gulp
```
### 安装指定版本
```
npm install gulp@3.9.1
```
对应信息会自动保存于该项目的package.json中。
### --save加入到dependencies（生产阶段的依赖）
```
npm install gulp --save
```
### --save-dev 加入到devDependencies（开发阶段的依赖）
```
npm install gulp --save-dev
```
### --save-optional 加入到optionalDependencies（可选阶段的依赖）
```
npm install gulp --save-optional
```
### --save-exact 精确安装指定模块版本
```
npm install gulp --save-exact
```
### -g 全局安装
```
npm install gulp -g
```
### package.json安装
模块的依赖都被写入了package.json文件后，通过npm install即可批量安装，此法最为常用。

## npm uninstall
卸载模块，和安装模板类似，比如说要卸载开发阶段的依赖：
```
npm uninstall gulp --save-dev
```
## npm undate
更新模块
```
npm update [-g] [<pkg>...]
```
## npm outdated
查看各模块最新版本

![img](/npm常用命令/1.png)

## npm ls
查看模块依赖，如查看全局模块：
```
npm ls -g
```
![img](/npm常用命令/2.png)

## npm init
初始化项目的package.json文件夹。

## npm root
查看包的安装路径，即输出node_modules的路径。

## npm config
管理配置文件
```
npm config set <key> <value> [-g|--global]
npm config get <key>
npm config delete <key>
npm config list
npm config edit
npm get <key>
npm set <key> <value> [-g|--global]
```

---

# **package.json**
说到npm，就不得不提package.json。先掌握[国人总结的中文文档](https://github.com/ericdum/mujiang.info/issues/6/)
这里展现下当前站点的package.json的demo：

``` javascript
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "hexo": {
    "version": "3.2.2"
  },
  "dependencies": {
    "hexo": "^3.2.0",
    "hexo-asset-image": "git+https://github.com/CodeFalling/hexo-asset-image.git",
    "hexo-deployer-git": "^0.1.0",
    "hexo-generator-archive": "^0.1.4",
    "hexo-generator-category": "^0.1.3",
    "hexo-generator-index": "^0.2.0",
    "hexo-generator-tag": "^0.2.0",
    "hexo-renderer-ejs": "^0.2.0",
    "hexo-renderer-marked": "^0.2.10",
    "hexo-renderer-stylus": "^0.3.1",
    "hexo-server": "^0.2.0"
  },
  "devDependencies": {
    "gulp": "^3.9.1",
    "gulp-sass": "^2.3.2",
    "gulp-sourcemaps": "^2.2.0",
    "yargs": "^6.3.0"
  }
}
```

---

# **第三方包**

主要介绍下自己接触到的第三方包.

## debug
一个方便需要 DEBUG=* 操作的工具.[其功能还有很多](https://www.npmjs.com/package/debug),以本站的express启动为例:

``` javascript
var debug = require('debug')('myapp');

var app = require('./app');
var config = require('./config/config');

app.set('config',config);

app.listen(app.get('config').port || 3000,function(){
    console.log('Express server start success');
    debug('Express server listening on port '+ app.get('config').port || 3000);
})

```

## gulp
不用过多介绍了,[使用实践](/2016/11/13/gulp使用实践/)

## mongoose
[node处理mongodb的工具](http://mongoosejs.com/),以model的方式,方便mongodb的增删改查.
以数据库的链接为例:

``` javascript
var debug = require('debug')('myapp');
var mongoose = require('mongoose');

var app = require('./app');
var config = require('./config/config');

app.set('config',config);

//启动mongo
mongoose.connect(app.get('config').dbUrl);
mongoose.connection.on('connected',function(){
    console.log('connect to the mongodb success');
});
mongoose.connection.on('error',function(err){
    console.log('connnect to the mongodb error:'+err);
    process.exit(1);
});
mongoose.connection.on('disconnected',function(){
    console.log('disconnect mongodb');
    process.exit(1);
});

```

## yargs
用来处理命令行参数的[工具](https://www.npmjs.com/package/yargs),与commander功能类似.

## commander
也是用来处理命令行的[工具](https://www.npmjs.com/package/commander),与yargs相比扩展性更强,举个例子:

``` javascript
var program = require('commander');

// 命令行参数配置
program
    .version('0.0.1')
    .option('-n, --name <value>', 'special name')
    .option('-u, --uglify <value>', 'isUglify (是否压缩js代码)')
    .option('-d, --debugMode <value>', '是否启动调试模式打包代码')
    .option('-b, --bowerUpdate <value>', '是否启动bower更新')
    .parse(process.argv);

console.log('uglify is ' + program.uglify);
//默认压缩webcommon.js文件
if(program.uglify != 'false'){
    program.uglify = true;
}

console.log('debugMode is ' + program.debugMode);
//默认不开启调试模式
if(program.debugMode != 'true'){
    program.debugMode = false;
}

//默认开启bowerupdate更新
console.log('bowerUpdate is ' + program.bowerUpdate);
if(program.bowerUpdate !='false'){
    program.bowerUpdate = true;
}


gulp = require('./style_build_task')(gulp, APP_NAME);
gulp = require('./special_build_task')(gulp, APP_NAME, APP_PATH, APP_DIST_PATH, program);

```

---

# **常见问题**

## npm速度太慢，切换吧
国内npm速度奇慢无比，果断切换到[淘宝的镜像](https://cnpmjs.org/)，每十分钟更新同步一次。

## nrm管理npm的源
可以使用nrm来管理npm的源.
首先安装nrm,使用淘宝源安装,快速:
```
npm  install nrm --registry=http://registry.npm.taobao.org/ -g -d  // 使用淘宝源安装，快速！
```

然后通过nrm ls查看现有源头.
通过nrm add netease http://rnpm.hz.netease.com/  来添加指定源.
通过nrm use来指定使用哪个源.

