/* Unit tests go here */
var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/^\/base\/src\/tests\/.*Test\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

jasmine.getJSONFixtures().fixturesPath = '/base/src/tests/fixture';
jasmine.getFixtures().fixturesPath = '/base/src/tests/fixture';

// Only start the Karma runner once.
var started = false,
    startKarma = function () {
        if (!started) {
            started = true;
            window.__karma__.start();
        }
    };

require.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src/main',
    paths: {
        Squire: '../main/components/Squire.js/src/Squire',
        utility: '../main/js/util/static/utility',
        constants: '../main/js/util/static/constants',
        interact: '../main/js/util/objects/interact',
        game: '../main/js/game'
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: startKarma
});