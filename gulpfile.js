"use strict";

// Load plugins
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const flatten = require("gulp-flatten");
const merge = require("merge-stream");
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
let uglify = require('gulp-uglify-es').default;

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

// BrowserSync reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// BrowserSync with timeout
function browserSyncReloadTimeout(done) {
    setTimeout(function () {
        browsersync.reload();
    }, 4000);
    done();
}

// Clean src folder
function clean() {
    return del([
        './src/*/**',
        './js/*',
        './css/*',
        '!./src/js/scripts.js',
        '!./src/scss/styles.scss',
    ]);
}

// Bring third party dependencies from node_modules into src directory
function modules() {
    // Bootstrap CSS
    let bootstrapCSS = gulp.src('./node_modules/bootstrap/scss/**/*')
        .pipe(gulp.dest('./src/scss/bootstrap'));
    // Bootstrap JS
    let bootstrapJS = gulp.src(
        './node_modules/bootstrap/dist/js/**/*'
    )
        .pipe(gulp.dest('./src/js/bootstrap'));
    // jQuery
    let jquery = gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
        .pipe(gulp.dest('./src/js/jquery'));

    // Popper
    let popper = gulp.src([
        './node_modules/popper.js/dist/umd/*',
        '!./node_modules/jquery/dist/popper-utils.js'
    ])
        .pipe(gulp.dest('./src/js/bootstrap'));

    // HC Offcanvas Nav CSS
    let hcCSS = gulp.src([
        './node_modules/hc-offcanvas-nav/src/scss/*',
        '!./node_modules/hc-offcanvas-nav/src/scss/demo.scss'
    ])
        .pipe(gulp.dest('./src/scss/hc-offcanvas-nav'));
    // HC Offcanvas Nav JS
    let hcJS = gulp.src([
        './node_modules/hc-offcanvas-nav/src/js/*'
    ])
        .pipe(gulp.dest('./src/js/hc-offcanvas-nav'));

    // Autocomplete JS lib
    let autocompleteJS = gulp.src([
        'node_modules/@tarekraafat/autocomplete.js/dist/js/autoComplete.js'
    ])
        .pipe(gulp.dest('./src/js/autocomplete'));

    return merge(bootstrapCSS, bootstrapJS, jquery, hcJS, hcCSS, autocompleteJS);
}

function minCSS() {
    return gulp.src('./src/scss/**/*.*css')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(flatten())
        .pipe(gulp.dest('./css'));
}

function minJS() {

    return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
        .pipe(uglify({mangle: false}))
        .pipe(flatten())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'))
    ;
}

// Watch files
function watchFiles() {
    gulp.watch("./**/*.scss", gulp.parallel(minCSS, browserSyncReload));
    gulp.watch("./src/**/*.js", gulp.parallel(minJS, browserSyncReloadTimeout));
    gulp.watch("./**/*.html", gulp.parallel(browserSyncReload));
}

// Define complex tasks
const src = gulp.series(modules, minCSS, minJS);
const build = gulp.series(src);
const watch = gulp.series(gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.clean = clean;
exports.src = src;
exports.build = build;
exports.watch = watch;
exports.default = watch;
