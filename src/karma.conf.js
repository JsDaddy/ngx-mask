// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-mocha-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../test-reports/coverage/showcase'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
      thresholds: {
        emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 5,
          lines: 5,
          branches: 5,
          functions: 5,
        },
        // thresholds per file
        each: {
          statements: 5,
          lines: 5,
          branches: 5,
          functions: 5,
        },
      },
    },
    reporters: ['mocha', 'kjhtml'],

    // Config for the karma-mocha-reporter
    // https://www.npmjs.com/package/karma-mocha-reporter
    mochaReporter: {
      // Ignore skipped from the output, very ueful when using fdescribe and only want the one test/class showing up
      ignoreSkipped: true,
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeNoSandbox'],
    singleRun: true,
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--no-default-browser-check',
          '--no-first-run',
          '--disable-default-apps',
        ],
      },
    },
  });
};
