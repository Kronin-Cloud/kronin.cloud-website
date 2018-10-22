const gulp = require('gulp');
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
// const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const nodemailer = require('nodemailer');
const gutil = require('gulp-mail');
// const rename = require('gulp-rename');
// const sass = require('gulp-sass');
// const gcmq = require('gulp-group-css-media-queries');
// const autoprefixer = require('gulp-autoprefixer');
// const cleanCSS = require('gulp-clean-css');
// const sourcemaps = require('gulp-sourcemaps');
// const concatCss = require('gulp-concat-css');

const path = {
    html: ['*.html', '_includes/**/*.html', '_layouts/*.html', 'pages/**/*.html', 'post/**/*.html'],
    // scss: 'assets/css/_scss/**/*.scss',
    css:  'assets/css/**/*.css',
    js:   'assets/js/**/*.js'
};


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

//
// gulp.task('js',function () {
//     return gulp.src('assets/js/main/**/*.js')
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('assets/js/minify'))
//         .pipe(uglify())
//         .pipe(rename('all.min.js'))
//         .pipe(gulp.dest('assets/js/minify'))
//         .on('error', gutil.log)
//
// });

//
gulp.task('sass', function () {
    return gulp.src('assets/css/_scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('_site/css/assets/css/'))
        .pipe(bs.stream())
        .pipe(gulp.dest('assets/css/css/'));

});
// gulp.task('minify-css',['sass'], function () {
//     return gulp.src(['assets/css/css/**/*.css', 'assets/css/main/**/*.css'])
//     // return gulp.src([ 'assets/css/main/**/*.css'])
//         .pipe(sourcemaps.init())
//         .pipe(concatCss("minify.css"))
//         .pipe(gcmq())
//         .pipe(autoprefixer(
//           {
//           browsers: ['> 0.1%'],
//           cascade: false
//         }
//         ))
//         .pipe(cleanCSS({
//           level: 2
//         }))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('assets/css/minify'))
// });


gulp.task('watch', function () {
    gulp.watch(path.html, ['jekyll:build', 'rebuild']);
});


gulp.task('browser-sync', ['build'],function () {
    bs.init({
      server: {
        baseDir: "_site"
      }
    });
});


gulp.task('serve', ['browser-sync', 'watch']);


gulp.task('rebuild', function () {
    bs.reload();
});

gulp.task('build', ['jekyll:build']);
