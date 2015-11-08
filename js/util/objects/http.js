/**
 * Created by cthaw on 11/8/15.
 */
function HttpRequest() {

    var GET_METHOD = 'GET', POST_METHOD = 'POST', PUT_METHOD = 'PUT',

        api = this,

        request;

    api.get = function (url, params) {

        request = new XMLHttpRequest();
        request.open(GET_METHOD, formatURL(url, params));
        setRequestHeaders(params.headers);
        request.onreadystatechange = constructReadyStateChange(params);
        request.send();
    };

    function formatURL(url, params) {

        var formattedUrl = url + "?";
        for (var key in params) {

            if (params.hasOwnProperty(key)) {
                formattedUrl += (key + "=" + params[key] + "&");
            }
        }

        return formattedUrl.substring(0, formattedUrl.length -1);
    }

    function setRequestHeaders(headers) {

        if (_util.isObject(headers)) {

            for (var key in headers) {

                if (headers.hasOwnProperty(key)) {
                    request.setRequestHeader(key, headers[key]);
                }
            }
        }
    }

    function constructReadyStateChange(params) {
        if (_util.isObject(params)) {

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
    }
}