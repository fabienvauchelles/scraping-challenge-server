'use strict';

const gulp = require('gulp'),
    path = require('path');

const $ = require('gulp-load-plugins')();

const conf = require('./conf');


gulp.task('lint', () => {
    return gulp.src([
        path.join(conf.paths.server, '**/*.js'),
        path.join(conf.paths.tools, '**/*.js'),
        '!node_modules/**'
    ])
        .pipe($.eslint())
        .pipe($.eslint.format());
});
