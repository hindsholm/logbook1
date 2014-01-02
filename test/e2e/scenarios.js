
/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('logbook', function() {

    'use strict';

    beforeEach(function() {
        browser().navigateTo('/app/index.html');
    });


    it('should automatically redirect to /list when location hash/fragment is empty', function() {
        expect(browser().location().url()).toBe("/detail");
    });


    describe('list', function() {

        beforeEach(function() {
            browser().navigateTo('#/list');
        });


        it('should render list when user navigates to /list', function() {
            expect(element('[ng-view] p:first').text()).
                toMatch(/partial for list/);
        });

    });


    describe('detail', function() {

        beforeEach(function() {
            browser().navigateTo('#/detail');
        });


        it('should render detail when user navigates to /detail', function() {
            expect(element('[ng-view] p:first').text()).
                toMatch(/partial for detail/);
        });

    });
});
