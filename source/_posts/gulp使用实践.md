---
title: gulp使用实践
date: 2016-11-13 10:01:43
categories: "node"
---

# **前言**
以前，在自己的工程中用过[grunt](http://blog.csdn.net/mevicky/article/details/48968183?locationNum=3&fps=1)，和他的一些插件比如[autoprefixer](http://blog.csdn.net/mevicky/article/details/49157295)、[jshint](http://blog.csdn.net/mevicky/article/details/50198345?locationNum=1&fps=1)等等。
也在	学习过[webpack](/categories/webpack/)的使用。而现在所处项目组用的是gulp来构建前端工作流，故此学习整理。

---

# **基本用法**
首先理解一遍[中文api](http://www.gulpjs.com.cn/docs/api/)。对新事物的学习，就直接有效的方法就是将官网全部浏览一遍。
## gulp.src(globs[,options])
输出文件流或文件，可以pipe到别的插件中去。
``` javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

### globs
string或array类型，要读取的glob或包含globs的数组。

### options
object类型，有以下参数：
#### options.buffer
boolean类型，默认为true，为false时会以steam形式而不是buffer形式返回结果。
#### options.read
boolean类型，默认为true，为false时，会返回空，也即是不去读取文件。
#### options.base
string类型，默认值为glob之前。看demo：
``` javascript
gulp.src('client/js/**/*.js') // 匹配 'client/js/somedir/somefile.js' 并且将 `base` 解析为 `client/js/`
  .pipe(minify())
  .pipe(gulp.dest('build'));  // 写入 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // 写入 'build/js/somedir/somefile.js'
```
## glup.dest(path[,options])
写操作，如果文件不存在，则创建之。
``` javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```
相对路径是根据base来计算的。

### path
string或者function类型，文件被写入的路径，也可以是一个函数，在函数中返回路径即可。

### options
object类型
#### options.cwd
string类型，默认值为process.cwd()，输出目录的cwd参数，只在所给的输出目录是相对路径时候有效。
#### options.mode
string类型，默认值为0777，八进制权限字符，用以定义所有在输出目录中所创建的目录的权限。

## gulp.task(name[,deps],fn)
定义一个任务
``` javascript
gulp.task('somename', function() {
  // 做一些事
});
```
### name
任务名称
### deps
类似为array，一个包含任务列表的数组，这些任务会在你当前任务运行之前完成
``` javascript
gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
  // 做一些事
});
```
### fn
该函数定义任务所要执行的一些操作。通常这种形式：
``` javascript
gulp.src().pipe(someplugin())
```
也可以是异步任务，接受callback：
``` javascript
// 在 shell 中执行一个命令
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // 编译 Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // 返回 error
    cb(); // 完成 task
  });
});
```
或者返回一个stream：
``` javascript
gulp.task('somename', function() {
  var stream = gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
  return stream;
});
```
或者返回一个promise：
``` javascript
var Q = require('q');

gulp.task('somename', function() {
  var deferred = Q.defer();

  // 执行异步的操作
  setTimeout(function() {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```
注意：**默认task将以最大的并发数执行，gulp会一次性运行所有的task并且不做任何等待**。如果我们需要构建一个任务队列，需要做以下事情：
1) 给出提示，告知task什么时候执行完毕；
2) 再给出提示，告知task依赖另外的task的完成

这里有一个demo。两个任务：one和two。two依赖one的完成：
``` javascript
var gulp = require('gulp');
// 返回一个 callback，因此系统可以知道它什么时候完成
gulp.task('one', function(cb) {
    // 做一些事 -- 异步的或者其他的
    cb(err); // 如果 err 不是 null 或 undefined，则会停止执行，且注意，这样代表执行失败了
});
// 定义一个所依赖的 task 必须在这个 task 执行之前完成
gulp.task('two', ['one'], function() {
    // 'one' 完成后
});
gulp.task('default', ['one', 'two']);
```
## gulp.watch(glob[,opts],tasks)或gulp.watch(glob[,opts,cb])
监视文件，并且在文件改变时做一些事情，总会返回一个事件

### gulp.watch(glob[,opts],tasks)
#### glob
类型为string或array，用来指定具体监控哪些文件的变动。
#### opts
object类型
#### tasks
array类型，需要在文件变动后执行的任务名称：
``` javascript
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```
### gulp.watch(glob[,opts,cb])
#### glob
类型为string或array，用来指定具体监控哪些文件的变动。
#### opts
object类型
#### cb(event)
function类型，每次变动需要执行的函数：
``` javascript
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```
该event对象记录监控到的变动
event.type:变动类型如added，changed，deleted
event.path：触发该事件的文件路径

## 使用
首先安装好gulp：
```
npm install --global gulp
```
在项目中引用：
```
npm install --save-dev gulp
```
npm具体语法，参考[别处](/2016/11/11/npm%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#more)。
默认执行default任务：
```
var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
```
运行命令：
```
gulp
```
想要单独执行特定的任务（task），请输入
```
gulp <task> <othertask>
```

---

# **常用插件**

这里主要将自己用到的插件进行整理，对做简单demo演示，方便日后复用。所有插件均可在[npm包查询页面](https://www.npmjs.com/package/package)中找到。

## yargs

一个用来接收命令参数并进行处理的模块，[官网api](https://www.npmjs.com/package/yargs)。
一个demo就可以解释其使用方式：
``` javascript
var argv = require('yargs').argv;
 
if (argv.ships > 3 && argv.distance < 53.5) {
    console.log('Plunder more riffiwobbles!');
} else {
    console.log('Retreat from the xupptumblers!');
}
```
使用方式：
```
$ ./plunder.js --ships=4 --distance=22
Plunder more riffiwobbles!

$ ./plunder.js --ships 12 --distance 98.7
Retreat from the xupptumblers!
```

## gulp-sass
一个很常用的模块，功能是将sass或scss代码转换为css代码。[官网api](https://www.npmjs.com/package/gulp-sass)。
具体用法请自行查阅api。这里以该站demo项目为例子，来演示该模块的使用。
首先在项目根目录下定义gulpfile.js文件：
``` javascript
var gulp = require('gulp'),
    config = require('./public/demo/tool/config.js');
require('./public/demo/tool/scripts/sass');
gulp.task('default', ['watch:scss']);
module.exports = gulp;
```
其中config.js文件中定义各个插件的输入输出路径：
``` javascript
module.exports = {
    scss: {
        srcPath: {
        	'pa':'./public/demo/pagesDemo/scss/**/*.scss'
        },
        outputPath: {
            'pa':'./public/demo/pagesDemo/css'
        }
    }
}; 
```

sass.js中则是gulp-sass模块的功能：
``` javascript

var gulp = require('gulp'),
	sass =require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	config = require('../config.js').scss,
	argv = require('yargs').argv;
//gulp-sass模块具体功能，将scss编译为css
gulp.task('scss',function(){
	var srcPath = config.srcPath[argv.p];
	var outputPath = config.outputPath[argv.p];
	
	return gulp.src(srcPath)
		.pipe(sourcemaps.init())
		.pipe(sass({
            'outputStyle': 'compressed',
            'errLogToConsole': true			
		}).on('error',sass.logError))
		.pipe(sourcemaps.write('./map'))
		.pipe(gulp.dest(outputPath));
});
//watch,自己监听文件修改进行编译
gulp.task('watch:scss',['scss'],function(){
	var pArr = argv.p;
	 console.log('********您已开启watch:'+ pArr + ' *********');
	var cssWatcher = gulp.watch(config.srcPath[pArr],['scss']);
	cssWatcher.on('change',function(event){
		console.log('File '+event.path+' was '+event.type);
	});
});

gulp.task('watch',['watch:scss']);
```
使用时：
![img](../gulp使用实践/1.png)


## **cheerio**

在node中,读取html文件并进行类jquery的dom操作的模块.[官方](https://www.npmjs.com/package/cheerio).

首先说下为何会有这种需求,最近想优化自己demo的创建流程,打算通过一段命令
gulp new -n=demoname,即可生成对应的html文件,scss文件,以及将html文件中引入对应
scss转换的css文件.故产生该需求.代码如下:

``` javascript
/**
 * Created by liufang on 2016/12/27.
 */
var gulp = require('gulp');
var argv = require('yargs').argv;
var fs = require('fs');
var cheerio = require('cheerio');

gulp.task('create',function(){
    var root = process.cwd();//当前文件路径
    var demoName = argv.n;//新建demo名称
    var htmlPath = root+'/public/demo/pagesDemo/'+demoName+'.html';//新建demo的html文件
    var tempHtml = root+'/public/demo/pagesDemo/temp.html';//模板html文件
    var scssPath = root+'/public/demo/pagesDemo/scss/'+demoName+'.scss';//新建demo的scss文件
    var tempScss = root+'/public/demo/pagesDemo/scss/temp.scss';//模板scss文件
    //生成html文件
    console.log('creating demo html :'+htmlPath);
    if(fs.existsSync(htmlPath)){
        console.log(demoName+'.html is already existed!!');
        process.exit(1);
    }
    var tempHtmlContent = fs.readFileSync(tempHtml);
    fs.writeFileSync(htmlPath,tempHtmlContent);
    console.log(htmlPath+' is created!!');
    //生成scss文件
    console.log('creating demo scss :'+scssPath);
    if(fs.existsSync(scssPath)){
        console.log(demoName+'.scss is already existed!!');
        process.exit(1);
    }
    var tempScssContent = fs.readFileSync(tempScss);
    fs.writeFileSync(scssPath,tempScssContent);
    console.log(scssPath+' is created!!');

    //将html中css的引用地址和scss文件生成的地址对应起来
    var content = fs.readFileSync(htmlPath);
    $ = cheerio.load(content);
    $('head').append('<link rel="stylesheet" href="css/'+demoName+'.css">');
    fs.writeFile(htmlPath, $.html(),function(err){
        if(err) throw err;
        console.log("html link changed");
    });
});
gulp.task('new',['create','watch']);
var gulp = require('gulp');
```

其中,将html中css的引用地址和scss文件生成的地址对应起来这一部分是cheerio的使用实例.

