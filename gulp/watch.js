'use strict';

const path = require('path'),
    gulp = require('gulp');

const conf = require('./conf');


gulp.task('watch', () => {
    gulp.watch([
            path.join(conf.paths.scss, '/**/*.scss'),
            path.join(conf.paths.src, '/**/*.scss'),
        ],
        () => gulp.start('styles')
    );
});
