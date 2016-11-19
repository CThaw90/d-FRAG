/**
 * Created by christhaw on 10/6/16.
 */
define('loader', ['exports', 'constants', 'levels', 'utility', 'http'], function (loader, constants, levels, utility, http) {

    var loading = {};

    loader.isFinished = function () {

        var finishedLoading = true;
        for (var key in loading) {
            if (loading.hasOwnProperty(key)) {
                finishedLoading = finishedLoading && loading[key];
            }
        }

        return finishedLoading;
    };

    loader.initialize = function () {
        loading[constants.configId] = false;
        http.get({
            url: constants.configurationUrl,
            onSuccess: function (response) {
                var configuration = window.JSON.parse(response);
                loader.loadLevels(configuration);
                loading[constants.configId] = true;
            }
        });
    };

    loader.loadLevels = function (configuration) {
        if (utility.isArray(configuration.levelFiles)) {
            configuration.levelFiles.forEach(function (levelFile, index) {
                var levelId = 'level' + index;
                loading[levelId] = false;
                http.get({
                    id: levelId,
                    url: levelFile,
                    onSuccess: function (response) {
                        var levelObject = window.JSON.parse(response);
                        levels.add(levelObject);
                        loading[this.id] = true;
                    }
                });
            });
        }
    };
});