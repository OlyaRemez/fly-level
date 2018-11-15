var syntax = "scss"; // Syntax: sass or scss;

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  concat = require("gulp-concat"),
  cleancss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  autoprefixer = require("gulp-autoprefixer"),
  notify = require("gulp-notify"),
  rsync = require("gulp-rsync");

gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: "app"
    },
    notify: false
  });
});

gulp.task("styles", function() {
  return gulp
    .src("app/" + syntax + "/**/*." + syntax + "")
    .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

gulp.task("js", function() {
  return (
    gulp
      .src([
        "app/libs/jquery/dist/jquery.slim.min.js",
        "app/js/common.js"
      ])
      .pipe(concat("scripts.min.js"))
      .pipe(gulp.dest("app/js"))
      .pipe(browserSync.reload({ stream: true }))
  );
});

gulp.task("rsync", function() {
  return gulp.src("app/**").pipe(
    rsync({
      root: "app/",
      hostname: "username@yousite.com",
      destination: "yousite/public_html/",
      exclude: ["**/Thumbs.db", "**/*.DS_Store"],
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    })
  );
});

gulp.task("watch", ["styles", "js", "browser-sync"], function() {
  gulp.watch("app/" + syntax + "/**/*." + syntax + "", ["styles"]);
  gulp.watch(["libs/**/*.js", "app/js/common.js"], ["js"]);
  gulp.watch("app/*.html", browserSync.reload);
});

gulp.task("default", ["watch"]);
