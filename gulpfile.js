var gulp = require("gulp");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
const terser = require("gulp-terser");
var cleanCSS = require("gulp-clean-css");

var paths = {
  styles: {
    src: "assets/scss/**/*.scss",
    dest: "assets/css/"
  },
  scripts: {
    src: "assets/scripts/**/*.js",
    dest: "scripts/"
  }
};

async function styles() {
  return (
    gulp
      .src(paths.styles.src)
      .pipe(sass())
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.styles.dest))
      // pass in options to the stream
      .pipe(
        rename({
          basename: "style",
          suffix: ".min"
        })
      )
      .pipe(gulp.dest(paths.styles.dest))
  );
}

function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(terser())
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

var build = gulp.series(gulp.parallel(styles, scripts));

exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;
