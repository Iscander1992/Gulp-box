"use strict";
const gulp =            require('gulp');
const scss =            require('gulp-sass');
const cssMin =          require('gulp-cssmin');
const concat =          require('gulp-concat-css');
const path =            require('path');
const watch =           require('gulp-watch');
const autoprefixer =    require('gulp-autoprefixer');
const preprocess =      require('gulp-preprocess');
const rename =          require('gulp-rename');
const pxtorem =         require('gulp-pxtorem');
const imagemin =        require('gulp-image');
const uglify =          require('gulp-uglify');
const concatJs =        require('gulp-concat');
const copy =            require('gulp-copy');
const browserSync =     require('browser-sync').create();
const reload =          browserSync.reload;
const notify =          require('gulp-notify');
const sourcemaps =      require('gulp-sourcemaps');
const babel =           require('gulp-babel');
const spritesmith =     require('gulp.spritesmith');
const runSequence =     require('run-sequence');

const params =          require('./config');

/**
 * BrowserSync
 */

gulp.task('webserver', function () {
    browserSync.init(params.build.dev.localserver);
});

/**
 * Copy
 */

gulp.task('copy:dev', () => {

    for (let p in params.build.dev.copy) {
        gulp.src(p)
            .pipe(gulp.dest(params.build.dev.copy[p]));
    }

});

gulp.task('copy:prod', () => {

    for (let p in params.build.prod.copy) {
        gulp.src(p)
            .pipe(gulp.dest(params.build.prod.copy[p]));
    }

});

gulp.task('copy', ['copy:dev', 'copy:prod']);

/**
 * JavaScript
 */

gulp.task('uglify:dev', () => {
    return gulp.src(params.src.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concatJs('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(params.build.dev.js))
        .pipe(reload({stream:true}))
        .pipe(notify({
            message: "JavaScript files changed"
        }));
});

gulp.task('uglify:prod', () => {
    gulp.src(params.build.prod.joinJs)
        .pipe(concatJs('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(params.build.prod.js));
});

gulp.task('uglify', ['uglify:dev', 'uglify:prod']);

/**
 * SCSS
 */

gulp.task('scss', () => {
    gulp.src(params.src.style)
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            cascade: false
        }))
        .pipe(pxtorem({replace: false}))
        .pipe(rename("style.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(params.build.dev.css))
        .pipe(reload({stream:true}))
        .pipe(notify({
            message: "SCSS files changed"
        }));
});

/**
 * CSS
 */

gulp.task('cssmin', ['scss'], () => {
    gulp.src(params.build.prod.joinCSS)
        .pipe(concat('style.min.css'))
        .pipe(cssMin())
        .pipe(gulp.dest(params.build.prod.css));
});


/**
 *  Sprite
 */

gulp.task('sprite', () => {
    let spriteData =
        gulp.src(params.src.sprite)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                imgPath: '../img/'
            }));

    spriteData.img.pipe(gulp.dest(params.build.dev.img));
    spriteData.css.pipe(gulp.dest(params.src.iconStyles));
});

/**
 * Images
 */

gulp.task('image:dev', () => {
    gulp.src(params.src.img)
        .pipe(gulp.dest(params.build.dev.img))
        .pipe(reload({stream:true}));
});

gulp.task('image:prod', ['sprite'], () => {
    gulp.src([params.src.img, params.build.dev.sptite])
        .pipe(imagemin({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            advpng: true,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true
        }))
        .pipe(gulp.dest(params.build.prod.img));
});

gulp.task('image', ['image:dev', 'image:prod']);

/**
 * HTML
 */

gulp.task('html:dev', () => {
    gulp.src(params.src.html)
        .pipe(sourcemaps.init())
        .pipe(preprocess({context: {NODE_ENV: 'dev', DEBUG: true}}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(params.build.dev.html))
        .pipe(reload({stream:true}))
        .pipe(notify({
            message: "HTML files changed"
        }));
});

gulp.task('html:prod', () => {
    gulp.src(params.src.html)
        .pipe(preprocess({context: {NODE_ENV: 'prod', DEBUG: true}}))
        .pipe(gulp.dest(params.build.prod.html))
});

gulp.task('html', ['html:dev', 'html:prod']);

/**
 * Watch
 */

gulp.task('watch', () => {
    gulp.start('webserver');
    watch([params.watch.style], () => gulp.start('scss'));
    watch([params.watch.html],  () => gulp.start('html:dev'));
    watch([params.watch.js],    () => gulp.start('uglify:dev'));
});

gulp.task('dev',  ['sprite',  'image:dev', 'copy:dev',  'html:dev',  'scss',   'uglify:dev']);
gulp.task('prod', ['image:prod', 'copy:prod', 'html:prod', 'cssmin', 'uglify:prod']);

gulp.task('default', ()=> {
    runSequence('dev', 'prod')
});
