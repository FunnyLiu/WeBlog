var gulp = require('gulp'),
    config = require('./public/demo/tool/config.js');
require('./public/demo/tool/scripts/sass');
//npm run new -- -n=demoName
//gulp create -n=demoName
require('./public/demo/tool/scripts/newPagesDemo');
require('./public/demo/tool/scripts/sprite');
//npm run css -- --p=pa
gulp.task('default', []);
module.exports = gulp;
