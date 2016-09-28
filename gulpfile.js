'use strict'

let gulp = require('gulp');

let $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'lazypipe']});

gulp.task('src', function () {
  let tsProcessor = $.lazypipe().pipe($.replace, '.scss', '.css');
  let cssProcessor = $.lazypipe().pipe($.sass);

  gulp.src('./src/**/*')
    .pipe($.if('*.ts', tsProcessor()))
    .pipe($.if('*.scss', cssProcessor()))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('json', function () {
  gulp.src('./angular-cli.json')
    .pipe($.rename({basename: "./angular-cli.tmp"}))
    .pipe(gulp.dest('./'))
    .pipe($.rename({basename: "./angular-cli"}))
    .pipe($.replace('.scss', '.css'))
    .pipe($.replace('"root": "src"', '"root": "tmp"'))
    .pipe($.replace('"main": "main.ts"', '"main": "main.prod.ts"'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['src', 'json']);
