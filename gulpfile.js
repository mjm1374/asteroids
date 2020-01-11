"use strict"

const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sourcemaps =  require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const sassdoc = require('sassdoc');
const order = require('gulp-order');
const plumber = require("gulp-plumber");
const babel = require('gulp-babel');

const input = {
    'sass': 'scss/**/*.scss',
    javascript: ['javascript/*.js'] ,
    'javascriptPage': ['js/page-component/*.js'],
    'vendor': 'vendor/**/*.js' 
};
//'javascript/controls.js','javascript/asteroids.js','javascript/collision.js','javascript/spacecraft.js','javascript/utils.js'

const inputOrder = {
    javascript: ['javascript/models.js','javascript/1_main.js','javascript/2_controls.js','javascript/*.js']
};   



// Transpile, concatenate and minify scripts
function scripts() {
  
    return gulp.src(['javascript/models.js','javascript/main.js', 'javascript/controls.js','javascript/asteroids.js','javascript/collision.js','javascript/spacecraft.js','javascript/utils.js'])
        //.pipe(order(['models.js','javascript/1_main.js','javascript/2_controls.js','javascript/*.js'], { cwd: './javascript' }))
        .on('error', onError)
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(plumber())
        .pipe(concat('script.min.js'))
        .on('error', onError)
        .pipe(uglify())
        .pipe(gulp.dest('js'));
  }

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    sourceComments: 'map'
};

function css() {
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
  }

function watchFiles(done) {
    gulp.watch('scss/*.scss', css);
    gulp.watch('javascript/*.js', scripts);
    done();
  }
function onError(err) {
    console.log(err);
    this.emit('end');
  }


  function defaultTask(done) {
    // place code for your default task here
    build();
    watch();
    done();
  }

const watch = gulp.parallel(watchFiles);
const js = gulp.series(scripts);
const build = gulp.series( gulp.parallel(css,js) );

exports.watch = watch;
exports.build = build;
exports.js = js;
exports.default = defaultTask;