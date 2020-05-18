const gulp = require("gulp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const jasmineBrowser = require('gulp-jasmine-browser');
const typescript = require("gulp-typescript");
const webpack = require("webpack-stream");

//copies the html to the disribution folder
function copyHtml()
{
	return gulp
		.src(["**/*.html"], {base: './frontend'})
		.pipe(gulp.dest("./dist"));
}

//copies the images folder to the distribution folder
function copyImgs()
{
	return gulp
		.src("src/assets/img/*")
		.pipe(gulp.dest("dist/assets/img"));
}

//sets gulp to add prefixes with Autoprefixer after Dreamweaver outputs the Sass filee to CSS
//once the prefixer finishes its job, outputs the file to the distribution folder
function styles()
{
	return gulp
		.src("src/css/*.css")
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("./dist/css"));
}

//deals with transforming the scripts to ES5 JS while in development mode
function scripts()
{
	return gulp
		.src(["src/**/*.ts"], {base: './frontend'})
		.pipe(sourcemaps.init())
		.pipe(typescript({
			target: "es6",
			module: "commonjs",
			rootDir: "./src",
			outDir: "./dist"
		}))
		.pipe(babel({presets: ['@babel/preset-env']}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("dist/js"))
}

//deals with bundling the scripts while in production mode
function scriptsDist()
{
	return gulp
		.src(["src/**/*.ts"], {base: './frontend'})
		.pipe(sourcemaps.init())
		.pipe(typescript({
			target: "es6",
			module: "commonjs",
			rootDir: "./src",
			outDir: "./dist"
		}))
		.pipe(babel({presets: ['@babel/preset-env']}))
		.pipe(webpack({
			mode: "production",
			entry: "src/main.ts",
			output: {
				filename: "app.bundle.js"
			}
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("dist"))
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
	gulp.watch("**/*.html", copyHtml);
	gulp.watch('src/assets/img/*', copyImgs);
	gulp.watch('src/css/*.css', styles);
	gulp.watch('src/**/*.ts', scripts);
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