'use strict';

/* jasmine specs for controllers go here */

describe('BLOSUM', function() {
    describe('BLOSUMService', function(){
        var scope, ctrl;
        beforeEach(module('blosumCalculatorAppDumbComputer'));
        beforeEach(inject(function($controller, $rootScope,BlosumService) {
            scope = $rootScope.$new();
            ctrl = $controller('DumbCtrl', {$scope: scope,BLOSUMService: BlosumService});
        }));

        it('should compute alphabet size (single sequence)', function() {
            var inData = ['ABC','BCA'];
            var matrices = scope.fun(inData);
            expect(matrices['alphabetSize']).toEqual(3);
        });

        it('should compute alphabet size', function() {
            var inData = ['ABC','BDA'];
            var matrices = scope.fun(inData);
            expect(matrices['alphabetSize']).toEqual(4);
        });

        it('should compute substitution matrix', function() {
            var inData = ['ABC','BBC','CBB'];
            var matrices = scope.fun(inData);
            expect(matrices['substitutionMatrix'].length).toEqual(3);
            expect(matrices['substitutionMatrix'][0].length).toEqual(3);
            expect(matrices['substitutionMatrix'][0]).toEqual([0,1,1]);
            expect(matrices['substitutionMatrix'][1]).toEqual([1,6,3]);
            expect(matrices['substitutionMatrix'][2]).toEqual([1,3,2]);
        });

        it('should compute pairProbability matrix', function() {
            var inData = ['AB','BA'];
            var matrices = scope.fun(inData);
            expect(matrices['substitutionMatrix'].length).toEqual(2);
            expect(matrices['substitutionMatrix'][0].length).toEqual(2);
            expect(matrices['substitutionMatrix'][0]).toEqual([0,2]);
            expect(matrices['substitutionMatrix'][1]).toEqual([2,0]);
            expect(matrices['pairProbabilityMatrix'][0]).toEqual([0,0.5]);
            expect(matrices['pairProbabilityMatrix'][1]).toEqual([0.5,0]);
        });

        it('should compute pairProbability matrix', function() {
            var inData = ['AB','BA'];
            var matrices = scope.fun(inData);
            expect(matrices['substitutionMatrix'].length).toEqual(2);
            expect(matrices['substitutionMatrix'][0].length).toEqual(2);
            expect(matrices['substitutionMatrix'][0]).toEqual([0,2]);
            expect(matrices['substitutionMatrix'][1]).toEqual([2,0]);

            expect(matrices['pairProbabilityMatrix'][0][0]).toBeCloseTo(0);
            expect(matrices['pairProbabilityMatrix'][0][1]).toBeCloseTo(0.5);
            expect(matrices['pairProbabilityMatrix'][1][0]).toBeCloseTo(0.5);
            expect(matrices['pairProbabilityMatrix'][1][1]).toBeCloseTo(0);
        });

        it('should compute symbolProbability matrix', function() {
            var inData = ['AB','BA'];
            var matrices = scope.fun(inData);
            expect(matrices['symbolProbabilityMatrix'][0]).toBeCloseTo(0.5);
            expect(matrices['symbolProbabilityMatrix'][1]).toBeCloseTo(0.5);
        });

        it('should compute symbolProbability matrix', function() {
            var inData = ['ABCD','DCBA','DBAC'];
            var matrices = scope.fun(inData);
            expect(matrices['symbolProbabilityMatrix'][0]).toBeCloseTo(1/4);
            expect(matrices['symbolProbabilityMatrix'][1]).toBeCloseTo(1/4);
            expect(matrices['symbolProbabilityMatrix'][2]).toBeCloseTo(1/4);
            expect(matrices['symbolProbabilityMatrix'][3]).toBeCloseTo(1/4);
        });

        it('should compute symbolProbability matrix', function() {
            var inData = ['AABC','AABD','AABE'];
            var matrices = scope.fun(inData);
            expect(matrices['symbolProbabilityMatrix'][0]).toBeCloseTo(1/2);
            expect(matrices['symbolProbabilityMatrix'][1]).toBeCloseTo(1/4);
            expect(matrices['symbolProbabilityMatrix'][2]).toBeCloseTo(1/12);
            expect(matrices['symbolProbabilityMatrix'][3]).toBeCloseTo(1/12);
            expect(matrices['symbolProbabilityMatrix'][4]).toBeCloseTo(1/12);
        });

    });
});
