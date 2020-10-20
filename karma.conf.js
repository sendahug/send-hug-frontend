const path = require('path');
const fs = require("fs");
var through = require('through');
process.env.CHROME_BIN = '/usr/bin/google-chrome-stable';

// Karma configuration file
module.exports = function (karma) {
  karma.set({
    basePath: '',
    frameworks: ['jasmine', 'browserify', 'viewport'],
    mime: { 'text/x-typescript': ['ts','tsx'] },
    files: [
        { pattern: "./tests/app.bundle.js" },
        { pattern: "src/tests.specs.ts" }
    ],
    preprocessors: {
        './tests/app.bundle.js': ['sourcemap'],
        'src/tests.specs.ts': ['browserify']
    },
    browserify: {
      debug: true,
      extensions: ['ts', 'tsx'],
      configure: function(bundle) {
        bundle.plugin('tsify', { target: 'es6' }).transform(function(file) {
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
				});

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
      }
    },
    coverageIstanbulReporter: {
      dir: path.resolve(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary']
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress', 'kjhtml', 'coverage', 'coverage-istanbul'],
    port: 9876,
    logLevel: 'DEBUG',
    autoWatch: false,
    browsers: ['ChromeNoSandbox'],
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
            '--disable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--disable-dev-shm-usage'
        ]
      }
    },
    singleRun: true,
	  browserDisconnectTimeout: 10000,
	  browserNoActivityTimeout: 100000
  });
};
