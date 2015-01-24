'use strict';

/* jasmine specs for controllers go here */

describe('BLOSUM', function() {
    describe('BLOSUMCtrl', function(){
        var scope, ctrl;
        beforeEach(module('blosumCalculatorAppComputer'));
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('BLOSUMCtrl', {$scope: scope});
        }));

        it('should be stopped at the beginning', function() {
            expect(scope.inComputationStart).toEqual(false);
        });

        it('should have no data', function() {
            expect(scope.inData).toEqual([]);
        });

        it('should have no data', function() {
            expect(scope.inData).toEqual([]);
        });

        it('should start when it should', function() {
            scope.inComputationStart = true;
            scope.inData = ['ABC'];
            scope.$digest();
            expect(scope.outFinished).toEqual(true);
        });

        it('should compute alphabet size (single sequence)', function() {
            scope.inData = ['ABC'];
            scope.inComputationStart = true;
            scope.$digest();
            expect(scope.outAlphabetSize).toEqual(3);
        });

        it('should compute alphabet size', function() {
            scope.inData = ['ABC','ABB','BCD'];
            scope.inComputationStart = true;
            scope.$digest();
            expect(scope.outAlphabetSize).toEqual(4);
        });

        it('should compute substitution matrix', function() {
            scope.inData = ['ABC','BBC','CBB'];
            scope.inComputationStart = true;
            scope.$digest();
            expect(scope.outSubstitutionMatrix.length).toEqual(3);
            expect(scope.outSubstitutionMatrix[0].length).toEqual(3);
            expect(scope.outSubstitutionMatrix[0]).toEqual([0,1,1]);
            expect(scope.outSubstitutionMatrix[1]).toEqual([1,6,3]);
            expect(scope.outSubstitutionMatrix[2]).toEqual([1,3,2]);
        });
    });
});
