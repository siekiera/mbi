'use strict';

describe('MainCtrl', function(){

    beforeEach(module('blosumCalculatorApp'));

    it('should create "Hello world" model', inject(function($controller) {
        var scope = {},
            ctrl = $controller('MainCtrl', {$scope:scope});

        expect(scope.text).toBe("Hello world!");
    }));

});