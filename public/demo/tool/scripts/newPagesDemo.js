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
