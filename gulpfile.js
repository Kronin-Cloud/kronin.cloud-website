var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var cp = require('child_process');
var browserSync = require('browser-sync');
const sw = require('sw-precache');
var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

// Rebuild Jekyll and page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', [ 'img', 'sw', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false
    });
});



// Compression images
gulp.task('img', function() {
	return gulp.src('assets/images/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
    .pipe(gulp.dest('_site/assets/images'))
    .pipe(browserSync.reload({stream:true}));
});


gulp.task('sw', function() {
  const rootDir ='./';
  const distDir = './_site';

  sw.write(`${rootDir}/sw.js`, {
    staticFileGlobs: [distDir + '/**/*.{js,html,css,png,jpg,svg,eot,ttf,woff,woff2}'],
    stripPrefix: distDir
  });
});

// Watch scss, html, img files
gulp.task('watch', function () {
    gulp.watch('assets/javascripts/**/*.js', ['jekyll-rebuild']);
    gulp.watch('assets/images/**/*', ['img']);
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_pages/*.html'], ['jekyll-rebuild']);
});

//  Default task
gulp.task('serve', ['browser-sync', 'watch', 'sw']);


gulp.task('browser-sync', ['jekyll-build'],function () {
    browserSync.init({
        server: {
            baseDir: "_site"
        }
    });
});
