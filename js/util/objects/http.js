/**
 * Created by cthaw on 11/8/15.
 *
 */
define('http', ['exports', 'utility'], function (http, utility) {

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

    self.formatURL = function (url, params) {
        var formattedUrl = url + "?";
        for (var key in params) {

            if (params.hasOwnProperty(key)) {
                formattedUrl += (key + "=" + params[key] + "&");
            }
        }

        return formattedUrl.substring(0, formattedUrl.length -1);
    };

    self.setRequestHeaders = function (headers) {
        if (utility.isObject(headers)) {

            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    request.setRequestHeader(key, headers[key]);
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

                console.log('Response from server is '+this.responseText);
            }
        };
    };

    http.get = function (config) {
        self.request = new XMLHttpRequest();
        self.request.open(self.GET_METHOD, self.formatURL(config.url, config.params));
        self.request.setRequestHeaders(config.headers);
        self.request.onreadystatechange = self.constructReadyStateChange(config);
        self.request.send();
    };
});