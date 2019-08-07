const gulp = require('gulp')
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const nodemon = require('gulp-nodemon')
const autoprefixer = require('gulp-autoprefixer')
const uglify = require('gulp-uglify');
const tap = require('gulp-tap');

gulp.task('javascript', () => {
  return gulp
    .src('src/scripts/*.js', { read: false })
    .pipe(tap(file => {
      file.contents = browserify(file.path, { debug: true })
        .transform('babelify', { presets: ['@babel/preset-env'], plugins: ['@babel/plugin-transform-runtime'] })
        .bundle();
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('../../maps'))
    .pipe(gulp.dest('public/scripts'))
})

gulp.task('style', () => {
  return gulp.src('src/css/*.css')
    .pipe(autoprefixer())
    .pipe(gulp.dest('public/css'))
})

gulp.task('devServer', done => {
  nodemon({
    script: './server/index.js',
    watch: 'server',
    env: {
      NODE_ENV: 'development'
    },
    done
  }).on('start', () => {
    setTimeout(() => {
      browserSync.init(
        {
          proxy: 'http://localhost:9091',
          files: ['./public/**'],
          port: 9092
        },
        () => {
          console.log('browser refreshed.')
        }
      )
    }, 500)
  })
})

gulp.task('watch', () => {
  return new Promise(resolve => {
    gulp.watch(['src/scripts/*.js', 'src/utils/*.js'], gulp.series('javascript'))
    gulp.watch('src/css/*.css', gulp.series('style'))
    resolve()
  })
})

gulp.task('build', gulp.parallel('javascript', 'style'))
gulp.task('start', gulp.parallel(gulp.series('build', 'devServer'), 'watch'))
