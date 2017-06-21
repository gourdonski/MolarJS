'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var flatten = require('gulp-flatten');

gulp.task('lint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('dist', function() {
    return gulp.src([ 'src/molar.js', 'src/extensions/*.js', 'src/core/**/*.js' ])
        .pipe(concat('molar.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename('molar.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist-lookup', function() {
    return gulp.src([ 'src/molar.js', 'src/extensions/*.js', 'src/core/lookup/*.js' ])
        .pipe(concat('molar-lookup.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename('molar-lookup.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('typings', function() {
    return gulp.src('typings/*.d.ts')
        .pipe(concat('molar.d.ts'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['dist']);
});

gulp.task('default', [ 'dist', 'dist-lookup', 'typings', 'watch' ]);