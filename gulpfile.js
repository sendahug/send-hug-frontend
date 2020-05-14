const gulp = require("gulp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const jasmineBrowser = require('gulp-jasmine-browser');
const order = require("gulp-order");

//copies the html to the disribution folder
function copyHtml()
{
	return gulp
		.src("index.html")
		.pipe(gulp.dest("./dist"));
};

//copies the images folder to the distribution folder
function copyImgs()
{
	return gulp
		.src("img/*")
		.pipe(gulp.dest("dist/img"));
}

//sets gulp to add prefixes with Autoprefixer after Dreamweaver outputs the Sass filee to CSS
//once the prefixer finishes its job, outputs the file to the distribution folder
function styles()
{
	return gulp
		.src("css/*.css")
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("./dist/css"));
}

//deals with concating the scripts while in development mode
function scripts()
{
	return gulp
		.src("js/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel({presets: ['@babel/preset-env']}))
		.pipe(order([
		
		]))
		.pipe(concat('all.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("dist/js"))
}

//deals with concating the scripts while in production mode
function scriptsDist()
{
	return gulp
		.src("js/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel({presets: ['@babel/preset-env']}))
		.pipe(order([
		
		]))
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("dist/js"))
}

//automatic testing in the Jasmine headless browser
function jasmineBrowserTest()
{
	return gulp
		.src(["dist/js/all.js", "tests/specs.js"])
		.pipe(jasmineBrowser.specRunner({ console: true }))
		.pipe(jasmineBrowser.headless({ driver: "chrome" }));
}

//testing in whatever browser you want to use; just enter "localhost:3001" in the address line
function browserTests()
{
	return gulp
		.src(["dist/js/all.js", "tests/specs.js"])
		.pipe(jasmineBrowser.specRunner())
		.pipe(jasmineBrowser.server({ port: 3001 }));
}

//prepare for distribution
function dist()
{
	return gulp
		.parallel(
			copyHtml,
			copyImgs, 
			styles, 
			scriptsDist
		);
}

//watch files for changes and then run the appropriate tasks
function watch()
{
	gulp.watch('/index.html', copyHtml);
	gulp.watch('img/*', copyImgs);
	gulp.watch('css/*.css', styles);
	gulp.watch('/js/*.js', scripts);
}

//exports for gulp to recognise them as tasks
exports.copyHtml = copyHtml;
exports.copyImgs = copyImgs;
exports.styles = styles;
exports.scripts = scripts;
exports.scriptsDist = scriptsDist;
exports.jasmineBrowserTest = jasmineBrowserTest;
exports.browserTests = browserTests;
exports.dist = dist;
exports.watch = watch;