var gulp            = require('gulp');
var sass            = require('gulp-sass');
var browserSync     = require('browser-sync').create();
var autoprefixer    = require('gulp-autoprefixer');
var cssnano         = require('gulp-cssnano');
var rename          = require('gulp-rename');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var del             = require('del');
var imagemin        = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress'); 
var pngquant        = require('imagemin-pngquant');
var cache           = require('gulp-cache');
var rigger          = require('gulp-rigger');


gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './app'
        },
    })
})
// gulp.task('html', function () {
//     gulp.src('./app/html/*.html') //Выберем файлы по нужному пути
//         .pipe(rigger()) //Прогоним через rigger
//         .pipe(gulp.dest('./app/')) //Выплюнем их в папку build
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });

gulp.task('sass', function() {
    return gulp.src('./app/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./app/css/'))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('./app/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('scripts', function() {
    return gulp.src('./app/js/vendor/*.js')
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('watch', ['browserSync' , 'scripts'], function() {
    gulp.watch('./app/scss/**/*.scss', function(event, cb) {
        // setTimeout(
            // function(){
                gulp.start('sass');
            // },
            // 500)
    });
    gulp.watch('./app/*.html', browserSync.reload); 
    gulp.watch('./app/js/**/*.js', browserSync.reload);
});  

gulp.task('clean', function() {
    return del.sync('./dist/');
});

gulp.task('img', function(){
    return gulp.src('./app/images/*').pipe(cache(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imageminJpegRecompress({progressive: true, method: 'smallfry', quality: 'veryhigh'}),
        pngquant(),
        imagemin.svgo({plugins: [{removeViewBox: false}]})
    ]))).pipe(gulp.dest('./dist/images'));
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src('./app/css/main.min.css')
    .pipe(gulp.dest('./dist/css/'));

    var buildJs = gulp.src('./app/js/*.js')
        .pipe(gulp.dest('./dist/js/'));

    var buildHtml = gulp.src('./app/index.html') 
        .pipe(gulp.dest('./dist/'));

    var buildFonts = gulp.src('./app/fonts/*') 
    .pipe(gulp.dest('./dist/fonts/'));

});