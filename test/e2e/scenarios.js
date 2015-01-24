'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('PhoneCat App', function() {

    describe('Phone list view', function () {

        beforeEach(function () {
            browser.get('app/index.html');
        });

        it('should display hello world', function () {

            var placeHolderText = element(by.id('textPlaceholder')).getText();
            expect(placeHolderText).toEqual("Hello world!");
        });

    });
});
