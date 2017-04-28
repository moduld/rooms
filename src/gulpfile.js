/**
 * Created by user on 22.03.17.
 */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

// for gulp watch
gulp.task('stylesHandle', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./'));
});


gulp.task('build:js', function() {
    gulp.src(['./js/*.js'])
        .pipe(concat('main_script.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/js/'))
});


gulp.task('build:css', function() {
    gulp.src(['./scss/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie10'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/css/'))
});

gulp.task('watch', function () {
    gulp.watch('./scss/*.scss', ['stylesHandle']);
});

gulp.task('build', ['build:css', 'build:js']);