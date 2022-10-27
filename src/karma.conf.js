// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-mocha-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },

        coverageReporter: {
            type: 'html',
            dir: 'coverage/',
            reporters: [{ type: 'html' }, { type: 'lcov' }],
        },

        // Config for the karma-mocha-reporter
        // https://www.npmjs.com/package/karma-mocha-reporter
        mochaReporter: {
            // Ignore skipped from the output, very useful when using fdescribe and only want the one test/class showing up
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
