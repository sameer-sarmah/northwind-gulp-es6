"use strict";

var gulp = require("gulp");
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var importCss = require('gulp-import-css');
var image = require('gulp-image');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var sourcemaps = require('gulp-sourcemaps');
var babelify=require("babelify");
var browserify=require("browserify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var gulpCopy = require('gulp-copy');
var runSequence = require('run-sequence');

gulp.task("copy-assets",function(){
    return gulp.src(["src/assets/*.jpg"])
	.pipe(gulp.dest('./build/assets/'));
});

gulp.task("transpile-es6", function () {

        return browserify("src/app/product.component.js")
        .transform('babelify', {
            presets: ['env'],
            plugins: ["transform-class-properties"]
        })
        .bundle()
        .pipe(source('product.component.js')) 
        .pipe(rename("bundle.js"))
        .pipe(buffer()) 
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'))
        .pipe(reload({stream:true}));
});

gulp.task('styles', function() {
  gulp.src('src/styles/*.css')
    .pipe(importCss())
    .pipe(image())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/css/'))
	.pipe(reload({stream:true}));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task ('watch', function(){
	gulp.watch('src/styles/*.css', ['styles']);
	gulp.watch('src/app/*.ts', ['scripts']);
  	gulp.watch('src/index.html', ['html']);
});

gulp.task('inject-js-css', function () {
    var target = gulp.src('./src/index.html');
    var sources = gulp.src(['./build/bundle.js', './build/css/main.css'], {read: false});
    return target.pipe(inject(sources))
      .pipe(gulp.dest('./'));

  });

gulp.task('build', function(callback) {
    runSequence(["styles","transpile-es6","copy-assets"],
                'inject-js-css','browser-sync', 'watch',
                callback);
  });

gulp.task("default", ["build"]);
