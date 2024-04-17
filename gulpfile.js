// node
const fs = require("fs");
const { exec } = require("child_process");
// gulp deps
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const less = require('gulp-less');
// everything else
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const Server = require('karma').Server;
const parseConfig = require('karma').config.parseConfig;
const glob = require("glob");

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
    .pipe(replace(/(<img src=")(.*)(\/assets.)(.*)(." >)/g, match => {
      if(match.indexOf('siteLogo') == -1) {
        let altIndex = match.indexOf('alt');
        let assetsIndex = match.indexOf('assets');
        let url = match.substring(assetsIndex, altIndex-2);
        let svg = fs.readFileSync(__dirname + `/src/${url}`, { encoding: 'utf-8' });

        let classIndex = match.indexOf('class');
        let endTagIndex = match.indexOf('>');
        let elementClass = match.substring(classIndex+7,endTagIndex-2)
        svg = svg.replace('svg', `svg class="${elementClass}"`);

        return svg;
      }
    }))
    .pipe(replace(/(image href=".\/bg_pattern.svg")/g, match => {
        return "image href=\"./assets/img/bg_pattern.svg\"";
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
    .src("src/assets/**/*", { encoding: false })
    .pipe(gulp.dest("localdev/assets/"));
}

//converts the less files to css and adds prefixes with Autoprefixer
function styles()
{
  return gulp
    .src("src/styles/*.less")
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("./localdev/css"));
}

//deals with transforming the scripts while in development mode
async function scripts()
{
  // A bit hacky, but worth it considering the massive size improvement
  // rollup provides vs @rollup/stream
  await exec("npm run rollup:dev");
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
  gulp.watch("src/assets/**/*", gulp.parallel(copyAssets, copyHtml));
  gulp.watch("src/styles/*.less", styles);
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
function serve() {
  browserSync.init({
    server: {
      baseDir: "./localdev"
    },
    single: true
  });
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
    .pipe(replace(/(<img src=")(.*)(\/assets.)(.*)(." >)/g, match => {
      if(match.indexOf('siteLogo') == -1) {
        let altIndex = match.indexOf('alt');
        let assetsIndex = match.indexOf('assets');
        let url = match.substring(assetsIndex, altIndex-2);
        let svg = fs.readFileSync(__dirname + `/src/${url}`, { encoding: 'utf-8' });

        let classIndex = match.indexOf('class');
        let endTagIndex = match.indexOf('>');
        let elementClass = match.substring(classIndex+7,endTagIndex-2)
        svg = svg.replace('svg', `svg class="${elementClass}"`);

        return svg;
      }
    }))
    .pipe(replace(/(image href=".\/bg_pattern.svg")/g, match => {
        return "image href=\"./assets/img/bg_pattern.svg\"";
    }))
    .pipe(rename({dirname:""}))
    .pipe(gulp.dest("./dist/app"));
}

//copies the index html to the disribution folder
function copyIndexDist()
{
  return gulp
    .src("index.html")
    .pipe(gulp.dest("./dist"));
}

//copies the assets folder to the distribution folder
function copyAssetsDist()
{
  return gulp
    .src("src/assets/**/*", { encoding: false })
    .pipe(gulp.dest("dist/assets/"));
}

//converts the less files to css and adds prefixes with Autoprefixer
function stylesDist()
{
  return gulp
    .src("src/styles/*.less")
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("./dist/css"));
}

//deals with transforming and bundling the scripts while in production mode
async function scriptsDist()
{
  // A bit hacky, but worth it considering the massive size improvement
  // rollup provides vs @rollup/stream
  await exec("npm run rollup:live");
}

//copy the service worker to the distribution folder; update the cache version on each build
function copyServiceWorker()
{
  return gulp
    .src('localdev/sw.js')
    .pipe(replace(/127.0.0.1:5000/g, (match) => {
            let newString = `send-hug-server.herokuapp.com`
            return newString;
          }))
    .pipe(replace(/send-hug-v7/g, (match) => {
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
function setupTests() {
  return gulp.src('src/tests.ts')
  .pipe(replace(/\/\/ test-placeholder/, (match) => {
    // find all the tests
    const tests = glob.globSync("app/**/*.spec.ts", {
      cwd: "./src"
    });
    let newString = '';

    // add each import to the tests file
    tests.forEach(testPath => {
      let newPath = './' + testPath.substring(0, testPath.length-3);
      newString += `import "${newPath}";
      `;
    })

      return newString;
    }))
  .pipe(rename("tests.specs.ts"))
  .pipe(gulp.dest('src/'))
}


// automatic testing in whatever browser is defined in the Karma config file
function unitTest()
{
  return new Server(parseConfig(__dirname + '/karma.conf.js')).start();
}

// run code bundling and then test
gulp.task('test', gulp.series(
  setupTests,
  unitTest
));

// boot up the server for e2e testing - headless
async function e2eServe() {
  bs = browserSync.init({
    server: {
      baseDir: "./localdev"
    },
    single: true,
    open: false,
    ui: false
  });

  await bs;
}

// run e2e tests
async function e2e() {
   // compile
   await localDev();

   // serve
   e2eServe();

   // run cypress
   await exec('npm run cypress', (error, stdout, stderr) => {
     if (error) {
        console.log(`error: ${error.message}`);
     }
     if (stderr) {
        console.log(`stderr: ${stderr}`);
     }
     console.log(`stdout: ${stdout}`);

     if(bs) {
       bs.cleanup();
     }
   })
}

//exports for gulp to recognise them as tasks
exports.copyHtml = copyHtml;
exports.copyIndex = copyIndex;
exports.copyAssets = copyAssets;
exports.styles = styles;
exports.scripts = scripts;
exports.localDev = localDev;
exports.serve = serve;
exports.scriptsDist = scriptsDist;
exports.dist = gulp.parallel(
  copyHtmlDist,
  copyIndexDist,
  copyAssetsDist,
  stylesDist,
  scriptsDist,
  copyServiceWorker,
  copyManifestDist
);
exports.watch = watch;
exports.e2e = e2e;
exports.setupTests = setupTests;
exports.e2eServe = e2eServe;
