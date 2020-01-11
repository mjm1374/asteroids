var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var sourcemaps =  require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sassdoc = require('sassdoc');
var order = require('gulp-order');
var input = {
    'sass': 'scss/**/*.scss',
    'javascript': ['javascript/models.js','javascript/main.js','javascript/controls.js','javascript/*.js'],
    'javascriptPage': ['js/page-component/*.js'],
    'vendor': 'vendor/**/*.js'
};

var inputOrder = {
    'javascript': ['javascript/models.js','javascript/main.js','javascript/controls.js','javascript/*.js']
};

output = {
    'stylesheets': 'stylesheets',
    'javascript': 'javascript',
    'javascriptPage': 'js/dist/page-component'
};
 

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    sourceComments: 'map'
};

gulp.task('sass', function () {
    return gulp.src(input.sass)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer())
        .on('error', onError)
        .pipe(cssnano())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('css'))
        .pipe(sassdoc())
        // Release the pressure back and trigger flowing mode (drain)
        // See: http://sassdoc.com/gulp/#drain-event
        .resume();
});

gulp.task('js', function () {
    return gulp.src(input.javascript)
        .pipe(order(inputOrder.javascript))
        .pipe(concat('script.min.js'))
        .on('error', onError)
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('javascript/*.js', ['js']);
});

function onError(err) {
    console.log(err);
    this.emit('end');
  }


gulp.task('default', ['sass', 'js', 'watch']);