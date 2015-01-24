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
            scope.inData = ['ABC','BCA'];
            scope.$digest();
            expect(scope.outFinished).toEqual(true);
        });

        it('should compute alphabet size (single sequence)', function() {
            scope.inData = ['ABC','BCA'];
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

        it('should compute pairProbability matrix', function() {
            scope.inData = ['AB','BA'];
            scope.inComputationStart = true;
            scope.$digest();
            expect(scope.outSubstitutionMatrix.length).toEqual(2);
            expect(scope.outSubstitutionMatrix[0].length).toEqual(2);
            expect(scope.outSubstitutionMatrix[0]).toEqual([0,2]);
            expect(scope.outSubstitutionMatrix[1]).toEqual([2,0]);
            expect(scope.outPairProbabilityMatrix[0]).toEqual([0,0.5]);
            expect(scope.outPairProbabilityMatrix[1]).toEqual([0.5,0]);
        });

        it('should compute pairProbability matrix', function() {
            scope.inData = ['AB','BA'];
            scope.inComputationStart = true;
            scope.$digest();
            expect(scope.outSubstitutionMatrix.length).toEqual(2);
            expect(scope.outSubstitutionMatrix[0].length).toEqual(2);
            expect(scope.outSubstitutionMatrix[0]).toEqual([0,2]);
            expect(scope.outSubstitutionMatrix[1]).toEqual([2,0]);

            expect(scope.outPairProbabilityMatrix[0][0]).toBeCloseTo(0);
            expect(scope.outPairProbabilityMatrix[0][1]).toBeCloseTo(0.5);
            expect(scope.outPairProbabilityMatrix[1][0]).toBeCloseTo(0.5);
            expect(scope.outPairProbabilityMatrix[1][1]).toBeCloseTo(0);
        });

        it('should compute symbolProbability matrix', function() {
            scope.inData = ['AB','BA'];
            scope.inComputationStart = true;
            scope.$digest();
            expect(scope.outSymbolProbabilityMatrix[0]).toBeCloseTo(0.5);
            expect(scope.outSymbolProbabilityMatrix[1]).toBeCloseTo(0.5);
        });

        it('should compute symbolProbability matrix', function() {
            scope.inData = ['ABCD','DCBA','DBAC'];
            scope.inComputationStart = true;
            scope.$digest();
            expect(scope.outSymbolProbabilityMatrix[0]).toBeCloseTo(1/4);
            expect(scope.outSymbolProbabilityMatrix[1]).toBeCloseTo(1/4);
            expect(scope.outSymbolProbabilityMatrix[2]).toBeCloseTo(1/4);
            expect(scope.outSymbolProbabilityMatrix[3]).toBeCloseTo(1/4);
        });

        it('should compute symbolProbability matrix', function() {
            scope.inData = ['AABC','AABD','AABE'];
            scope.inComputationStart = true;
            scope.$digest();
            expect(scope.outSymbolProbabilityMatrix[0]).toBeCloseTo(1/2);
            expect(scope.outSymbolProbabilityMatrix[1]).toBeCloseTo(1/4);
            expect(scope.outSymbolProbabilityMatrix[2]).toBeCloseTo(1/12);
            expect(scope.outSymbolProbabilityMatrix[3]).toBeCloseTo(1/12);
            expect(scope.outSymbolProbabilityMatrix[4]).toBeCloseTo(1/12);
        });

    });
});
