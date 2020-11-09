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
const fs = require("fs");
const path = require("path");
var through = require('through');
const execFile = require('child_process').execFile;
const webdriverUpdate = require('protractor/node_modules/webdriver-manager/built/lib/cmds/update');
var Server = require('karma').Server;
let bs;

// LOCAL DEVELOPMENT TASKS
// ===============================================
//copies the html to the disribution folder
function copyHtml()
{
	return gulp
		.src("src/app/**/*.html")
		.pipe(replace(/(<img src="..\/assets.)(.*)(.">)/g, (match) => {
				if(match.indexOf('siteLogo') == -1) {
					let altIndex = match.indexOf('alt');
					let url = match.substring(13, altIndex-2);
					let svg = fs.readFileSync(__dirname + `/src/${url}`);

					return svg;
				}
				else {
					return match;
				}
			}))
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

//copies the assets folder to the distribution folder
function copyAssets()
{
	return gulp
		.src("src/assets/**/*")
		.pipe(gulp.dest("localdev/assets/"));
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

// copy webmanifest
function copyManifest() {
	return gulp
		.src("src/manifest.webmanifest")
		.pipe(gulp.dest("./localdev"));
}

//watch files for changes and then run the appropriate tasks
function watch()
{
	gulp.watch("src/app/**/*.html", copyHtml)
	gulp.watch("index.html", copyIndex);
	gulp.watch("src/assets/**/*", copyAssets);
	gulp.watch("src/css/*.css", styles);
	gulp.watch(["src/**/*.ts", "!src/**/*.spec.ts", "!src/**/*.mock.ts"], scripts);
	gulp.watch("src/manifest.webmanifest", copyManifest);
}

//create local development files
async function localDev() {
	copyHtml();
	copyIndex();
	copyAssets();
	styles();
	copyManifest();
	await scripts();
}

//boot up the server
async function serve() {
	bs = browserSync.init({
		server: {
			baseDir: "./localdev"
		},
		single: true
	});

	await bs;
}

// PRODUCTION TASKS
// ===============================================
//copies the html to the disribution folder
function copyHtmlDist()
{
	return gulp
		.src("src/app/**/*.html")
		.pipe(replace(/(<img src="..\/assets.)(.*)(.">)/g, (match) => {
				if(match.indexOf('siteLogo') == -1) {
					let altIndex = match.indexOf('alt');
					let url = match.substring(13, altIndex-2);
					let svg = fs.readFileSync(__dirname + `/src/${url}`);

					return svg;
				}
				else {
					return match;
				}
			}))
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

//copies the assets folder to the distribution folder
function copyAssetsDist()
{
	return gulp
		.src("src/assets/**/*")
		.pipe(gulp.dest("dist/assets/"));
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

// copy webmanifest
function copyManifestDist() {
	return gulp
		.src("src/manifest.webmanifest")
		.pipe(gulp.dest("./dist"));
}

//prepare for distribution
gulp.task('dist', gulp.parallel(
	copyHtmlDist,
	copyIndexDist,
	copyAssetsDist,
	stylesDist,
	scriptsDist,
	copyServiceWorker,
	copyManifestDist
));

// TESTING TASKS
// ===============================================
// import all the tests to main file
// credit for this goes to @hackerhat
// https://github.com/facebook/create-react-app/issues/517#issuecomment-417943099
function setupTests() {
	return gulp.src('src/tests.ts')
	.pipe(replace(/\/\/ test-placeholder/, (match) => {
		let newString = '';

		function readDirectory(directory) {
	    fs.readdirSync(directory).forEach((file) => {
	      const fullPath = path.resolve(directory, file);
				const regularExpression = /\.spec\.ts$/;

	      if (fs.statSync(fullPath).isDirectory()) {
	        readDirectory(fullPath);
	      }

	      if (!regularExpression.test(fullPath)) return;

				let hugIndex = fullPath.indexOf('app');
				let newPath = './' + fullPath.substring(hugIndex);
	      newString += `import "${newPath}";
				`;
	    });
	  }

		readDirectory(path.resolve(__dirname, 'src'));

			return newString;
		}))
	.pipe(rename("tests.specs.ts"))
	.pipe(gulp.dest('src/'))
}

// bundle up the code before the tests
function bundleCode() {
	var b = browserify({
		debug: true
	}).add("src/main.ts").plugin(tsify, { target: 'es6' }).transform(function(file) {
		var data = '';
		return through(write);

		// write the stream, replacing templateUrls
		function write(buf) {
			let codeChunk = buf.toString("utf8");

			// inline the templates
			let replacedChunk = codeChunk.replace(/(templateUrl: '.)(.*)(.component.html')/g, (match) => {
				let componentName = match.substring(16, match.length-16);
				let componentTemplate;

				if(componentName == 'app') {
					componentTemplate = fs.readFileSync(__dirname + `/src/app/${componentName}.component.html`);
				}
				else {
					componentTemplate = fs.readFileSync(__dirname + `/src/app/components/${componentName}/${componentName}.component.html`);
				}

				let newString = `template: \`${componentTemplate}\``
				return newString;
			});
			// add the SVGs
			let secondReplacedChunk = replacedChunk.replace(/(<img src="..\/assets.)(.*)(.">)/g, (match) => {
				let altIndex = match.indexOf('alt');
				let url = match.substring(13, altIndex-2);
				let svg = fs.readFileSync(__dirname + `/src/${url}`);

				return svg;
			})

			data += secondReplacedChunk
			this.queue(data);
		}
	}).transform(require('browserify-istanbul')({
		instrumenterConfig: {
                  embedSource: true
                },
		ignore: ['**/node_modules/**', '**/*.mock.ts', '**/*.spec.ts'],
		defaultIgnore: false
	}));

	return b.bundle()
			.pipe(source("src/main.ts"))
			.pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true, largeFile: true}))
			.pipe(rename("app.bundle.js"))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest("./tests"));
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
	setupTests,
	bundleCode,
	unitTest
));

// run development server & protractor
async function runProtractor() {
	serve();

	// update webdriver
	await webdriverUpdate.program.run({
			standalone: false,
			gecko: false,
			quiet: true,
	});
	// run protractor
	await execFile('./node_modules/protractor/bin/protractor', ['./e2e/protractor.conf.js'], (error, stdout, stderr) => {
	    if (error) {
	        console.error('error: ', stderr);
	        throw error;
	    }
			else {
				console.log(stdout);
				stopDevServer();
			}
	});
}

// stop the development server
function stopDevServer() {
	if(bs) {
		bs.cleanup();
		process.exit();
	}
}

// run e2e testing
gulp.task('e2e', gulp.series(
	localDev,
	scripts,
	runProtractor
))

//exports for gulp to recognise them as tasks
exports.copyHtml = copyHtml;
exports.copyIndex = copyIndex;
exports.copyAssets = copyAssets;
exports.styles = styles;
exports.scripts = scripts;
exports.localDev = localDev;
exports.serve = serve;
exports.scriptsDist = scriptsDist;
exports.watch = watch;
