var themename = 'website';
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browsersync = require('browser-sync').create(),
    reload  = browsersync.reload,
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'), 
    uglify = require('gulp-uglify'),
    lineec = require('gulp-line-ending-corrector');


var root = '../' + themename + '/',
    scss = root + 'sass/',
    js = root + 'src/js/',
    dist = root + 'dist/css/',
    jsdist = root + 'dist/js/';


var phpWatchFiles = root + '**/*.php', 
    cssWatchFiles = root + '**/*.scss';

var jsSRC = [ 

    js + 'jquery-2.2.4.min.js', 
    js + 'popper.min.js', 
    js + 'bootstrap.min.js', 
    js + 'plugins.js', 
    js + 'map-active.js', 
    js + 'active.js'

];

var cssSRC = [ 

    root + 'src/css/bootstrap.min.css',
    root + 'src/css/owl.carousel.min.css',
    root + 'src/css/animate.css',
    root + 'src/css/magnific-popup.css',
    root + 'src/css/font-awesome.min.css',
    root + 'src/css/customStyles.css',
    root + 'src/css/responsive.css',
    root + 'style.css'
 


];

var imageSRC = root + 'src/images/*',
    imageDest = root + 'dist/images';


function css() {
    return gulp.src([scss + 'style.scss'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(lineec())
    .pipe(gulp.dest(root));
}

function concatCSS () {
    return gulp.src(cssSRC)
    .pipe(sourcemaps.init({loadMaps: true, largeFile: true}))
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./modules/'))
    .pipe(lineec())
    .pipe(gulp.dest(dist));

}

function JavaScript () {
    return gulp.src(jsSRC)
    .pipe(concat('final.js'))
    .pipe(uglify())
    .pipe(lineec())
    .pipe(gulp.dest(jsdist))
}

function imagemin() {
    return gulp.src(imageSRC)
    .pipe(changed(imageDest))
    .pipe(imagemin([

        imagemin.gifsicle({interlaced: true},
        imagemin.jpegtran({progressive: true})),
        imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest(imageDest));
}

function watch() {
    browsersync.init({
        open: 'external',
        proxy: 'http://localhost:8888/php-starter-1/website/',
        port: 8080,

    });
    gulp.watch(cssWatchFiles, gulp.series([css, concatCSS]));
    gulp.watch(jsSRC, JavaScript);
    gulp.watch(imageSRC, imagemin);
    gulp.watch([phpWatchFiles, jsdist + 'final.js', dist + 'style.min.css', root + 'style.css']).on('change', browsersync.reload); 

}

exports.css = css;
exports.concatCSS = concatCSS;
exports.JavaScript = JavaScript;
exports.watch = watch;
exports.imagemin = imagemin;

var build = gulp.parallel(watch);
gulp.task('default', build); 