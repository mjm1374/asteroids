var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var sourcemaps =  require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sassdoc = require('sassdoc');

gulp.task('sass', function () {
    return gulp.src('scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulp.dest('css'))
        .pipe(sassdoc())
        // Release the pressure back and trigger flowing mode (drain)
        // See: http://sassdoc.com/gulp/#drain-event
        .resume();
});

gulp.task('js', function () {
    return gulp.src(['javascript/models.js','javascript/main.js','javascript/controls.js','javascript/*.js'])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('javascript/*.js', ['js']);
});

gulp.task('default', ['sass', 'js', 'watch']);