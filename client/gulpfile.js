var gulp = require("gulp");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var ejs = require("gulp-ejs");
var sass = require("gulp-sass");
var declare = require("gulp-declare");
var handlebars = require("gulp-handlebars");
var defineModule = require("gulp-define-module");
var connect = require('connect');

gulp.task("server", function() {
  connect.createServer(connect.static("./build")).listen(3000);
  connect.createServer(connect.static("./spec") ).listen(3001);
});

gulp.task("scss", function () {
  gulp.src("./scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./build"));
});

gulp.task("js", function() {
  gulp.src([
    "./js/vendor/jquery-2.1.0.js",
    "./js/vendor/handlebars-v1.3.0.js",
    "./js/vendor/underscore.js",
    "./js/vendor/underwear.js",
    "./js/vendor/backbone.js",
    "./js/templates.js",
    "./js/application.js"
  ])
  .pipe(concat("application.js"))
  .pipe(gulp.dest("./build"));
});

gulp.task("templates", function(){
  gulp.src("./js/templates/**/*.hbs")
    .pipe(handlebars())
    .pipe(defineModule("plain"))
    .pipe(declare({
      namespace: "App.Templates"
    }))
    .pipe(concat("templates.js"))
    .pipe(gulp.dest("./js"));
});

gulp.task("spec", function() {
  gulp.src("./spec/**/*_spec.js")
    .pipe(concat("compiled_specs.js"))
    .pipe(gulp.dest("./spec"));

  gulp.src("./build/application.js")
    .pipe(gulp.dest("./spec/lib"));
});

gulp.task("html", function() {
  gulp.src("./html/**/*.html")
    .pipe(gulp.dest("./build"));
});

gulp.task("watch", function() {
  gulp.watch("./scss/**/*.scss", function() {
    gulp.run("scss");
  });

  gulp.watch("./js/**/*.js", function() {
    gulp.run("js");
  });

  gulp.watch("./js/templates/**/*.hbs", function() {
    gulp.run("templates");
  });

  gulp.watch("./html/**/*.html", function() {
    gulp.run("html");
  });

  gulp.watch(["./spec/**/*_spec.js", "./build/application.js"], function() {
    gulp.run("spec");
  });
});

gulp.task("default", ["watch", "server"]);