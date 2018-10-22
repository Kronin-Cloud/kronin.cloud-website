const gulp = require('gulp');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
// const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const rename = require('gulp-rename');

const path = {
    html: ['*.html', '_includes/**/*.html', '_layouts/*.html', 'pages/**/*.html'],
    // scss: '_scss/**/*.scss',
    js: ['assets/js/*.js', 'assets/js/**/*.js']
};

// gulp.task('jekyll:build', ['sass'], function (done) {
gulp.task('jekyll:build', function (done) {
    exec('jekyll build', function (error, stdout, stderr) {
        if (error){
            console.log(`exec error ${error}`);
            return;
        }
        console.log(`exec stdout ${stdout}`);
        console.log(`exec stderr ${stderr}`);
        done();
    });
});


gulp.task('build', ['jekyll:build'], function () {
    return gulp.src('assets/js/*.js')
        .pipe(concat('common.js'))
        .pipe(gulp.dest('_site/assets/js'))
        // .pipe(uglify())
        // .pipe(rename('common.min.js'))
        // .pipe(gulp.dest('_site/assets/js'))
        .on('error', gutil.log)
});


gulp.task('browser-sync', ['build'],function () {
    bs.init({
        server: {
            baseDir: "_site"
        }
    });
});

gulp.task('sass', function () {
    return gulp.src('scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('_site/assets/css/'))
        .pipe(bs.stream())
        .pipe(gulp.dest('assets/css/'));

});

gulp.task('jekyll:rebuild', ['build'],function () {
    bs.reload();
});


gulp.task('watch', function () {
    gulp.watch(path.html, ['jekyll:rebuild']);
    // gulp.watch(path.scss, ['sass']);
    gulp.watch(path.js, ['build']);
});

gulp.task('serve', ['browser-sync', 'watch']);



