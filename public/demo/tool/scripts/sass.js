
var gulp = require('gulp'),
	sass =require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	config = require('../config.js').scss,
	argv = require('yargs').argv;
var pArr;
gulp.task('scss',function(){
    if(argv.p){
        pArr = argv.p;
    }else{
        pArr = 'pa';
    }

	var srcPath = config.srcPath[pArr];
	var outputPath = config.outputPath[pArr];
	
	return gulp.src(srcPath)
		.pipe(sourcemaps.init())
		.pipe(sass({
            'outputStyle': 'compressed',
            'errLogToConsole': true			
		}).on('error',sass.logError))
		.pipe(sourcemaps.write('./map'))
		.pipe(gulp.dest(outputPath));
});

gulp.task('watch:scss',['scss'],function(){
    console.log('********您已开启watch:'+ pArr + ' *********');
	var cssWatcher = gulp.watch(config.srcPath[pArr],['scss']);
	cssWatcher.on('change',function(event){
		console.log('File '+event.path+' was '+event.type);
	});
});

gulp.task('watch',['watch:scss']);
