'use strict';

/* jasmine specs for controllers go here */
describe('PhoneCat controllers', function() {

  describe('MainCtrl', function(){
    var scope, ctrl;

    beforeEach(module('blosumCalculatorApp'));
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('MainCtrl', {$scope: scope});
    }));

    it('should text equal hello world', function() {
      expect(scope.text).toEqual("Hello world!");
    });
  });
});
