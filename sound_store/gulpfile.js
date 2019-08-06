const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();


function styles() {
    return gulp.src('./src/less/style.less')
                .pipe(less())
                .pipe(concat('style.css'))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(cleanCSS({
                    level: 2
                }))
                .pipe(gulp.dest('./build/css'))
                .pipe(browserSync.stream());
}
function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        },
       // tunnel: true
    });
    gulp.watch('./src/less/**/*.less',styles);
    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles',styles);
gulp.task('watch',watch);