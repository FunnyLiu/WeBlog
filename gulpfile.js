var gulp = require('gulp'),
    config = require('./public/demo/tool/config.js');
require('./public/demo/tool/scripts/sass');
//gulp new -n=demoName
//gulp create -n=demoName
require('./public/demo/tool/scripts/newPagesDemo');
//gulp --p=pa
gulp.task('default', ['watch:scss']);
module.exports = gulp;
