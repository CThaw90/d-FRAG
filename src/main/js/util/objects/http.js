/**
 * Created by cthaw on 11/8/15.
 *
 */
define('http', ['exports', 'utility', 'debug'], function (http, utility, debug) {

    var self = {
        DELETE_METHOD: 'DELETE',
        POST_METHOD: 'POST',
        PUT_METHOD: 'PUT',
        GET_METHOD: 'GET',
        request: null,
        config: {
            url: String(),
            params: {}
        }
    };

    http.formatURL = function (url, params) {
        var formattedUrl = url + "?", ampersand = "";
        for (var key in params) {

            if (params.hasOwnProperty(key)) {
                formattedUrl += (ampersand + key + "=" + params[key]);
                ampersand = "&";
            }
        }

        return formattedUrl;
    };

    self.setRequestHeaders = function (headers) {
        if (utility.isObject(headers)) {

            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    self.request.setRequestHeader(key, headers[key]);
                }
            }
        }
    };

    self.constructReadyStateChange = function (params) {
        if (utility.isObject(params)) {

            return function () {
                if (this.readyState === 4) {

                    if (params.onSuccess && this.status >= 200 && this.status <= 300) {
                        params.onSuccess(this.responseText);
                    }
                    else if (params.onError && this.status >= 300) {
                        params.onError(this.responseText);
                    }
                }
            };
        }

        return function () {

            if (this.readyState === 4) {

                debug.trace('Response from server is '+this.responseText);
            }
        };
    };

    http.get = function (config) {
        self.request = new XMLHttpRequest();
        self.request.open(self.GET_METHOD, http.formatURL(config.url, config.params));
        self.setRequestHeaders(config.headers);
        self.request.onreadystatechange = self.constructReadyStateChange(config);
        self.request.send();
    };
});