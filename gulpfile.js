var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    del = require('del'),
    runSequence = require('run-sequence');

var path = {
    src: {
      html: 'src/[^_]*.html',
      style: 'src/scss/style.scss',
      js: 'src/js/**/*.js',
      img: 'src/img/**/*.{png,svg,jpg}',
      font: 'src/font/**/*.*'
    },
    tmp: {
      html: '.tmp',
      css: '.tmp/css',
      js: '.tmp/js',
      img: '.tmp/img',
      font: '.tmp/font'
    },
    build: {
      html: 'build',
      css: 'build/css',
      js: 'build/js',
      img: 'build/img',
      font: 'build/font'
    },
    watch: {
      html: 'src/*.html',
      style: 'src/scss/**/*.scss',
      js: 'src/js/**/*.js',
      img: 'src/img/**/*.{png,svg,jpg}',
      font: 'src/font/**/*.*'
    },
    clean: ['build', '.tmp']
};

gulp.task('html', function() {
  return gulp.src(path.src.html)
    .pipe($.htmlTagInclude())
    .pipe(gulp.dest(path.tmp.html))
    .pipe(gulp.dest(path.build.html));
});
 
gulp.task('sass', function () {
  return gulp.src(path.src.style)
    .pipe($.sourcemaps.init())
      .pipe($.sass().on('error', $.sass.logError))
      .pipe($.autoprefixer({browsers: ['> 1%', 'IE >= 9']}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(path.tmp.css))
    // .pipe($.minifyCss())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js));
})
 
gulp.task('img', function() {
  return gulp.src(path.src.img)
    .pipe($.cache($.imagemin({ progressive: true, interlaced: true })))
    .pipe(gulp.dest(path.build.img));
});

gulp.task('font', function() {
  return gulp.src(path.src.font)
    .pipe(gulp.dest(path.build.font));
});

// Remove the build directory.
gulp.task('clean', del.bind(null, path.clean, { dot: true }));

// Watch files for changes and reload the page in the browser when they do.
gulp.task('watch', [ 'html', 'sass', 'js', 'img', 'font' ], function() {
  browserSync({ notify: false, server: ['.tmp', 'src'] });
  gulp.watch([ path.watch.style ], [ 'sass', browserSync.reload ]);
  gulp.watch([ path.watch.html ], [ 'html', browserSync.reload ]);
  gulp.watch([ path.watch.img ], browserSync.reload);
});

// Build the source and serve the result.
gulp.task('watch:build', [ 'build' ], function () {
  browserSync({ notify: false, server: 'build' });
});

// Build the source.
gulp.task('build', [ 'clean' ], function (callback) {
  runSequence([ 'sass', 'html', 'js', 'img', 'font' ], callback);
});

gulp.task('default', [ 'watch' ]);