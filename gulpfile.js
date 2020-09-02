const gulp = require("gulp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const tsify = require("tsify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const webpack = require('webpack-stream');
const path = require('path');
const ngTools = require('@ngtools/webpack');
var Server = require('karma').Server;

// LOCAL DEVELOPMENT TASKS
// ===============================================
//copies the html to the disribution folder
function copyHtml()
{
	return gulp
		.src("src/app/**/*.html")
		.pipe(rename({dirname:""}))
		.pipe(gulp.dest("./localdev/app"));
}

//copies the index html to the disribution folder
function copyIndex()
{
	return gulp
		.src("index.html")
		.pipe(gulp.dest("./localdev"));
}

//copies the images folder to the distribution folder
function copyImgs()
{
	return gulp
		.src("src/assets/img/*")
		.pipe(gulp.dest("localdev/assets/img"));
}

//sets gulp to add prefixes with Autoprefixer after Dreamweaver outputs the Sass filee to CSS
//once the prefixer finishes its job, outputs the file to the distribution folder
function styles()
{
	return gulp
		.src("src/css/*.css")
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("./localdev/css"));
}

//deals with transforming the scripts while in development mode
function scripts()
{
	var b = browserify({
		debug: true
	}).add("src/main.ts").plugin(tsify, {target: "es6"});

	return b.bundle()
      .pipe(source("src/main.ts"))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
				.pipe(replace(/(templateUrl: '.)(.*)(.component.html)/g, (match) => {
					let componentName = match.substring(15, match.length-15);
					let newString = `templateUrl: './app/${componentName}.component.html`
					return newString;
				}))
        .pipe(babel({presets: ["@babel/preset-env"]}))
				.pipe(rename("app.bundle.js"))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./localdev"));
}

//watch files for changes and then run the appropriate tasks
function watch()
{
	gulp.watch("src/app/**/*.html", copyHtml)
	gulp.watch("index.html", copyIndex);
	gulp.watch("src/assets/img/*", copyImgs);
	gulp.watch("src/css/*.css", styles);
	gulp.watch(["src/**/*.ts", "!src/**/*.spec.ts", "!src/**/*.mock.ts"], scripts);
}

//create local development files
gulp.task('localdev', gulp.parallel(
	copyHtml,
	copyIndex,
	copyImgs,
	styles,
	scripts
));

// PRODUCTION TASKS
// ===============================================
//copies the html to the disribution folder
function copyHtmlDist()
{
	return gulp
		.src("src/app/**/*.html")
		.pipe(rename({dirname:""}))
		.pipe(gulp.dest("./dist/app"));
}

//copies the index html to the disribution folder
function copyIndexDist()
{
	return gulp
		.src("index.html")
		.pipe(replace(/src="app.bundle.js"/, () => {
			let newString = `src="app.bundle.min.js"`
			return newString;
		}))
		.pipe(gulp.dest("./dist"));
}

//copies the images folder to the distribution folder
function copyImgsDist()
{
	return gulp
		.src("src/assets/img/*")
		.pipe(gulp.dest("dist/assets/img"));
}

//sets gulp to add prefixes with Autoprefixer after Dreamweaver outputs the Sass filee to CSS
//once the prefixer finishes its job, outputs the file to the distribution folder
function stylesDist()
{
	return gulp
		.src("src/css/*.css")
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("./dist/css"));
}

//deals with transforming and bundling the scripts while in production mode
function scriptsDist()
{
	var b = browserify().add("src/main.ts").plugin(tsify, {target: "es6"});

	return b.bundle()
      .pipe(source("src/main.ts"))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
		.pipe(replace(/(templateUrl: '.)(.*)(.component.html)/g, (match) => {
						let componentName = match.substring(15, match.length-15);
						let newString = `templateUrl: './app/${componentName}.component.html`
						return newString;
					}))
		.pipe(replace(/production: false/, () => {
						let newString = `production: true`
						return newString;
					}))
        .pipe(babel({presets: ["@babel/preset-env"]}))
				.pipe(uglify())
				.pipe(rename("app.bundle.min.js"))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./dist"));
}

//copy the service worker to the distribution folder; update the cache version on each build
function copyServiceWorker()
{
	return gulp
		.src('localdev/sw.js')
		.pipe(replace(/localhost:5000/g, (match) => {
						let newString = `send-hug-server.herokuapp.com`
						return newString;
					}))
		.pipe(replace(/send-hug-v2/g, (match) => {
						let currentVersion = Number(match.substring(10, match.length));
						let newVersion = currentVersion + 1;
						let newString = `send-hug-v${newVersion}`
						return newString;
					}))
		.pipe(gulp.dest('./dist'))
}

//prepare for distribution
gulp.task('dist', gulp.parallel(
	copyHtmlDist,
	copyIndexDist,
	copyImgsDist,
	stylesDist,
	scriptsDist,
	copyServiceWorker
));

// TESTING TASKS
// ===============================================
// bundle up the files before the tests as there's an apparent memory leak
// in karma-webpack
function bundleCode() {
	return gulp.src('src/main.ts')
    .pipe(webpack({
			devtool: "eval-source-map",
	    entry: {
	      app: './src/main.ts'
	    },
			output: {
				filename: '[name].js'
			},
	    mode: "development",
	    node: { fs: 'empty' },
	    module: {
	        rules: [
	            {
	                test: /\.html$/,
	                loader: 'html-loader'
	            },
	            {
	                test: /\.svg$/,
	                loader: 'svg-inline-loader'
	            },
	            {
	              test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
	              loader: [
	                '@ngtools/webpack',
	                { loader: 'angular-router-loader' }
	              ]
	            }
	        ]
	    },
	    optimization: {
	      splitChunks: false
	    },
	    resolve: {
	        extensions: [".ts", ".js"]
	    },
	    plugins: [
	      new ngTools.AngularCompilerPlugin({
	        tsConfigPath: 'tsconfig.json',
	        basePath: './',
	        entryModule: path.resolve(__dirname, 'src/app/app.module#AppModule'),
	        skipCodeGeneration: true,
	        sourceMap: true,
	        directTemplateLoading: false,
	        locale: 'en',
	        hostReplacementPaths: {
	          'src/environments/config.development.ts': 'src/environments/config.production.ts'
	        }
	      })
	    ]
    }))
    .pipe(gulp.dest('tests/'));
}

// automatic testing in whatever browser is defined in the Karma config file
function unitTest()
{
	return new Server({
	    configFile: __dirname + '/karma.conf.js'
	  }).start();
}

// run code bundling and then test
gulp.task('test', gulp.series(
	bundleCode,
	unitTest
));

//boot up the server
gulp.task("serve", function() {
	browserSync.init({
		server: {
			baseDir: "./localdev"
		},
		single: true
	});
});

//exports for gulp to recognise them as tasks
exports.copyHtml = copyHtml;
exports.copyIndex = copyIndex;
exports.copyImgs = copyImgs;
exports.styles = styles;
exports.scripts = scripts;
exports.scriptsDist = scriptsDist;
exports.unitTest = unitTest;
exports.watch = watch;
