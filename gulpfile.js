const gulp = require("gulp");
const clean = require("gulp-clean");
const uglifyJS = require("gulp-uglify");
const uglifyCSS = require("gulp-clean-css");
const uglifyHTML = require("gulp-htmlmin");
const inject = require("gulp-inject");
const rename = require("gulp-rename");

function generateTimestamp() {
  const now = new Date().getTime();
  return Math.round(now / 1000);
}

function cleanBuild() {
  return gulp.src("build/", { allowEmpty: true, read: false }).pipe(clean());
}

function minifyJS() {
  const timestamp = generateTimestamp();

  return gulp
    .src("js/main.js")
    .pipe(uglifyJS())
    .pipe(rename({ extname: `.${timestamp}.min.js` }))
    .pipe(gulp.dest("build/js/"));
}

function minifyCSS() {
  const timestamp = generateTimestamp();

  return gulp
    .src("css/main.css")
    .pipe(uglifyCSS())
    .pipe(rename({ extname: `.${timestamp}.min.css` }))
    .pipe(gulp.dest("build/css/"));
}

function moveAssets() {
  return gulp.src(["assets/**/*.*", "sitemap.xml"]).pipe(gulp.dest("build/"));
}

function moveVendorJS() {
  return gulp.src("js/*.min.js").pipe(gulp.dest("build/js"));
}

function moveVendorCSS() {
  return gulp.src("css/*.min.css").pipe(gulp.dest("build/css"));
}

function moveHTML() {
  return gulp.src("*.html").pipe(gulp.dest("build/"));
}

function injectHTMLAssets() {
  const sources = gulp.src(["build/js/*.js", "build/css/*.css"]);
  const options = { addRootSlash: false, ignorePath: "build/" };

  return gulp
    .src("build/*.html")
    .pipe(inject(sources, options))
    .pipe(gulp.dest("build/"));
}

function minifyHTML() {
  return gulp
    .src("build/*.html")
    .pipe(
      uglifyHTML({
        removeComments: true,
        removeAttributeQuotes: false,
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest("build/"));
}

exports.clean = cleanBuild;

exports.default = gulp.series(
  cleanBuild,
  moveAssets,
  moveVendorJS,
  moveVendorCSS,
  minifyCSS,
  minifyJS,
  moveHTML,
  injectHTMLAssets,
  minifyHTML
);
