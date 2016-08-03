/**
 * Created by christhaw on 7/27/16.
 */
define(['http'], function (http) {
    /* globals describe, it, xit, jasmine, spyOn, beforeEach */
    describe('Http module', function () {

        it('should properly format a url with parameters', function () {
            expect(http.formatURL('/defrag-unit-tests/http', {
                method: 'GET',
                resource: 'd-frag',
                accept: 'json'
            })).toEqual('/defrag-unit-tests/http?method=GET&resource=d-frag&accept=json');
        });
    });
});