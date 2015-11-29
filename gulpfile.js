const gulp = require('gulp'),
    wrench = require('wrench');

wrench
    .readdirSyncRecursive('./gulp')
    .filter((file) => (/\.js$/i).test(file))
    .map((file) => require('./gulp/' + file));

gulp.task('default', ['styles']);
