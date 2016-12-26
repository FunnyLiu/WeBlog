var gulp = require('gulp'),
    config = require('./public/demo/tool/config.js');
require('./public/demo/tool/scripts/sass');
//gulp --p=pa
gulp.task('default', ['watch:scss']);
module.exports = gulp;
