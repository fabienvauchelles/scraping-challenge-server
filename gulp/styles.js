'use strict';

const _ = require('lodash'),
    gulp = require('gulp'),
    path = require('path');

const $ = require('gulp-load-plugins')();

const conf = require('./conf');


gulp.task('styles', ()  => {
    const sassOptions = {
        style: 'expanded'
    };

    const injectFiles = gulp.src([
        path.join(conf.paths.src, '/**/*.scss'),
    ], {
        read: false,
    });

    const injectOptions = {
        transform: (filePath) => {
            filePath = filePath.replace(conf.paths.src + '/', '../' + conf.paths.src + '/');

            return '@import "' + filePath + '";';
        },
        starttag: '// injector',
        endtag: '// endinjector',
        addRootSlash: false
    };

    return gulp.src([
        path.join(conf.paths.scss, '/index.scss'),
        path.join(conf.paths.scss, '/vendor.scss')
    ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(conf.paths.src));
});
