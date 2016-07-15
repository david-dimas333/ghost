/*globals describe, it, before, beforeEach, after */
var should          = require('should'),
    getPaginatedUrl = require('../../../server/data/meta/paginated_url'),
    configUtils     = require('../../utils/configUtils');

describe('getPaginatedUrl', function () {
    var data, getTestUrls;

    beforeEach(function () {
        data = {};
    });

    getTestUrls = function getTestUrls() {
        return {
            next: getPaginatedUrl('next', data, true),
            prev: getPaginatedUrl('prev', data, true),
            page1: getPaginatedUrl(1, data),
            page5: getPaginatedUrl(5, data),
            page10: getPaginatedUrl(10, data)
        };
    };

    it('should be a function', function () {
        should.exist(getPaginatedUrl);
    });

    describe('index', function () {
        it('should calculate correct urls for the first page of the index channel', function () {
            // Setup tests
            data.relativeUrl = '/';
            data.pagination = {prev: null, next: 2};

            // Execute test
            var urls = getTestUrls();

            // Check results
            urls.should.have.property('next', 'http://127.0.0.1:8081/page/2/');
            urls.should.have.property('prev', null);
            urls.should.have.property('page1', '/');
            urls.should.have.property('page5', '/page/5/');
            urls.should.have.property('page10', '/page/10/');
        });

        it('should calculate correct urls for the second page of the index channel', function () {
            // Setup tests
            data.relativeUrl = '/page/2/';
            data.pagination = {prev: 1, next: 3};

            // Execute test
            var urls = getTestUrls();

            // Check results
            urls.should.have.property('next', 'http://127.0.0.1:8081/page/3/');
            urls.should.have.property('prev', 'http://127.0.0.1:8081/');
            urls.should.have.property('page1', '/');
            urls.should.have.property('page5', '/page/5/');
            urls.should.have.property('page10', '/page/10/');
        });

        it('should calculate correct urls for the last page of the index channel', function () {
            // Setup tests
            data.relativeUrl = '/page/10/';
            data.pagination = {prev: 9, next: null};

            // Execute test
            var urls = getTestUrls();

            // Check results
            urls.should.have.property('next', null);
            urls.should.have.property('prev', 'http://127.0.0.1:8081/page/9/');
            urls.should.have.property('page1', '/');
            urls.should.have.property('page5', '/page/5/');
            urls.should.have.property('page10', '/page/10/');
        });
    });

    describe('other', function () {
        it('should calculate correct urls for the first page of another channel', function () {
            // Setup tests
            data.relativeUrl = '/featured/';
            data.pagination = {prev: null, next: 2};

            // Execute test
            var urls = getTestUrls();

            // Check results
            urls.should.have.property('next', 'http://127.0.0.1:8081/featured/page/2/');
            urls.should.have.property('prev', null);
            urls.should.have.property('page1', '/featured/');
            urls.should.have.property('page5', '/featured/page/5/');
            urls.should.have.property('page10', '/featured/page/10/');
        });

        it('should calculate correct urls for the second page of another channel', function () {
            // Setup tests
            data.relativeUrl = '/featured/page/2/';
            data.pagination = {prev: 1, next: 3};

            // Execute test
            var urls = getTestUrls();

            // Check results
            urls.should.have.property('next', 'http://127.0.0.1:8081/featured/page/3/');
            urls.should.have.property('prev', 'http://127.0.0.1:8081/featured/');
            urls.should.have.property('page1', '/featured/');
            urls.should.have.property('page5', '/featured/page/5/');
            urls.should.have.property('page10', '/featured/page/10/');
        });

        it('should calculate correct urls for the last page of another channel', function () {
            // Setup tests
            data.relativeUrl = '/featured/page/10/';
            data.pagination = {prev: 9, next: null};

            // Execute test
            var urls = getTestUrls();

            // Check results
            urls.should.have.property('next', null);
            urls.should.have.property('prev', 'http://127.0.0.1:8081/featured/page/9/');
            urls.should.have.property('page1', '/featured/');
            urls.should.have.property('page5', '/featured/page/5/');
            urls.should.have.property('page10', '/featured/page/10/');
        });
    });

    describe('with /blog subdirectory', function () {
        before(function () {
            configUtils.set({url: 'http://testurl.com/blog'});
        });

        after(function () {
            configUtils.restore();
        });

        it('should calculate correct urls for index', function () {
            // Setup tests
            data.relativeUrl = '/page/2/';
            data.pagination = {prev: 1, next: 3};

            // Execute test
            var urls = getTestUrls();

            // Check results
            urls.should.have.property('next', 'http://testurl.com/blog/page/3/');
            urls.should.have.property('prev', 'http://testurl.com/blog/');
            urls.should.have.property('page1', '/blog/');
            urls.should.have.property('page5', '/blog/page/5/');
            urls.should.have.property('page10', '/blog/page/10/');
        });

        it('should calculate correct urls for another channel', function () {
            // Setup tests
            data.relativeUrl = '/featured/page/2/';
            data.pagination = {prev: 1, next: 3};

            // Execute test
            var urls = getTestUrls();

            // Check results
            urls.should.have.property('next', 'http://testurl.com/blog/featured/page/3/');
            urls.should.have.property('prev', 'http://testurl.com/blog/featured/');
            urls.should.have.property('page1', '/blog/featured/');
            urls.should.have.property('page5', '/blog/featured/page/5/');
            urls.should.have.property('page10', '/blog/featured/page/10/');
        });
    });
});
