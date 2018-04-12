var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function () {
    var root = process.cwd();//当前文件路径
    var inputPath = root+'/public/demo/tool/spriteContent/input/';
    var outPath = root+'/public/demo/tool/spriteContent/output/';
    console.log('inputPath为'+inputPath);
    console.log('outPath为'+outPath);
    var spriteData = gulp.src(inputPath+'*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        padding: 20
    }));
    return spriteData.pipe(gulp.dest(outPath));
});