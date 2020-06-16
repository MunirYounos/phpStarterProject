const   gulp = require('gulp');
const   sass = require('gulp-sass');
const   autoprefixer  = require('gulp-autoprefixer');
const   minifyCss = require('gulp-clean-css');
const   browserSync = require('browser-sync').create();

//compile sass
function sassRun(){
    //where is my scss files
    return gulp.src('./wp-content/themes/polio/dev/scss/**/*.scss')
    //pass that file to sass compiler
    .pipe(sass().on('error', sass.logError))
    //distination
    //auto prefix
    .pipe(autoprefixer('last 2 version','> 1%','safari 5'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./wp-content/themes/polio/assets/css'))
    // stream changes to all browser
    .pipe(browserSync.stream());
}
function watch(){
    browserSync.init({
        proxy: "http://localhost:8888"
    });
    gulp.watch('./wp-content/themes/polio/dev/scss/**/*.scss', sassRun);
    gulp.watch('./wp-content/themes/polio/**/*.php').on('change', browserSync.reload);
    gulp.watch('./wp-content/themes/polio/assets/js/**/*.js').on('change', browserSync.reload);
}

exports.sassRun = sassRun; 
exports.watch = watch;