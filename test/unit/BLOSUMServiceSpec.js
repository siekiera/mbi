'use strict';

/* jasmine specs for controllers go here */

describe('BLOSUM', function() {
    describe('BLOSUMService', function(){
        var service;
        beforeEach(module('blosumComputer'));
        beforeEach(inject(function(BLOSUMService) {
            service = BLOSUMService;
        }));

        it('should compute alphabet size (single sequence)', function() {
            var inData = ['ABC','BCA'];
            var matrices = service.getMatrices(inData);
            expect(matrices['alphabetSize']).toEqual(3);
        });

        it('should compute alphabet size', function() {
            var inData = ['ABC','BDA'];
            var matrices = service.getMatrices(inData);
            expect(matrices['alphabetSize']).toEqual(4);
        });

        it('should compute substitution matrix', function() {
            var inData = ['ABC','BBC','CBB'];
            var matrices = service.getMatrices(inData);
            expect(matrices['substitutionMatrix'].length).toEqual(3);
            expect(matrices['substitutionMatrix'][0].length).toEqual(3);
            expect(matrices['substitutionMatrix'][0]).toEqual([0,1,1]);
            expect(matrices['substitutionMatrix'][1]).toEqual([1,6,3]);
            expect(matrices['substitutionMatrix'][2]).toEqual([1,3,2]);
        });

        it('should compute substitution matrix (ext)', function() {
            var inData = ['CCAAABAC','CCAABBAB','BBCACBAB','CBCACBAB','CCCABBAB','CCCBBBAB'];
            var matrices = service.getMatrices(inData);
            expect(matrices['substitutionMatrix'].length).toEqual(3);
            expect(matrices['substitutionMatrix'][0].length).toEqual(3);
            expect(matrices['substitutionMatrix'][0]).toEqual([52,8,10]);
            expect(matrices['substitutionMatrix'][1]).toEqual([8,58,24]);
            expect(matrices['substitutionMatrix'][2]).toEqual([10,24,46]);
        });

        it('should compute pairProbability matrix', function() {
            var inData = ['AB','BA'];
            var matrices = service.getMatrices(inData);
            expect(matrices['substitutionMatrix'].length).toEqual(2);
            expect(matrices['substitutionMatrix'][0].length).toEqual(2);
            expect(matrices['substitutionMatrix'][0]).toEqual([0,2]);
            expect(matrices['substitutionMatrix'][1]).toEqual([2,0]);

            expect(matrices['pairProbabilityMatrix'][0][0]).toBeCloseTo(0);
            expect(matrices['pairProbabilityMatrix'][0][1]).toBeCloseTo(0.5);
            expect(matrices['pairProbabilityMatrix'][1][0]).toBeCloseTo(0.5);
            expect(matrices['pairProbabilityMatrix'][1][1]).toBeCloseTo(0);
        });

        it('should compute pairProbability matrix (ext)', function() {
            var inData = ['CCAAABAC','CCAABBAB','BBCACBAB','CBCACBAB','CCCABBAB','CCCBBBAB'];
            var matrices = service.getMatrices(inData);
            expect(matrices['pairProbabilityMatrix'][0][0]).toBeCloseTo(52 / 240);
            expect(matrices['pairProbabilityMatrix'][0][1]).toBeCloseTo(8 / 240);
            expect(matrices['pairProbabilityMatrix'][0][2]).toBeCloseTo(10 / 240);
            expect(matrices['pairProbabilityMatrix'][1][1]).toBeCloseTo(58 / 240);
            expect(matrices['pairProbabilityMatrix'][1][2]).toBeCloseTo(24 / 240);
            expect(matrices['pairProbabilityMatrix'][2][2]).toBeCloseTo(46 / 240);
        });


        it('should compute symbolProbability matrix', function() {
            var inData = ['AB','BA'];
            var matrices = service.getMatrices(inData);
            expect(matrices['symbolProbabilityMatrix'][0][0]).toBeCloseTo(0.5);
            expect(matrices['symbolProbabilityMatrix'][0][1]).toBeCloseTo(0.5);
        });

        it('should compute symbolProbability matrix 3s4x4c', function() {
            var inData = ['ABCD','DCBA','DBAC'];
            var matrices = service.getMatrices(inData);
            expect(matrices['symbolProbabilityMatrix'][0][0]).toBeCloseTo(1/4);
            expect(matrices['symbolProbabilityMatrix'][0][1]).toBeCloseTo(1/4);
            expect(matrices['symbolProbabilityMatrix'][0][2]).toBeCloseTo(1/4);
            expect(matrices['symbolProbabilityMatrix'][0][3]).toBeCloseTo(1/4);
        });

        it('should compute symbolProbability matrix 3s4x5c', function() {
            var inData = ['AABC','AABD','AABE'];
            var matrices = service.getMatrices(inData);
            expect(matrices['symbolProbabilityMatrix'][0][0]).toBeCloseTo(1/2);
            expect(matrices['symbolProbabilityMatrix'][0][1]).toBeCloseTo(1/4);
            expect(matrices['symbolProbabilityMatrix'][0][2]).toBeCloseTo(1/12);
            expect(matrices['symbolProbabilityMatrix'][0][3]).toBeCloseTo(1/12);
            expect(matrices['symbolProbabilityMatrix'][0][4]).toBeCloseTo(1/12);
        });

        it('should compute BLOSUM matrix 3s4x5c', function() {
            var inData = ['AABC','AABD','AABE'];
            var matrices = service.getMatrices(inData);
            expect(matrices['BLOSUMMatrix'][0]).toEqual([2,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY]);
            expect(matrices['BLOSUMMatrix'][1]).toEqual([Number.NEGATIVE_INFINITY,4,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY]);
            expect(matrices['BLOSUMMatrix'][2]).toEqual([Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,5,5]);
            expect(matrices['BLOSUMMatrix'][3]).toEqual([ Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, 5, Number.NEGATIVE_INFINITY, 5 ] );
            expect(matrices['BLOSUMMatrix'][4]).toEqual([ Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, 5, 5, Number.NEGATIVE_INFINITY ]);
        });

        it('should compute BLOSUM matrix 6s4x3c', function() {
            var inData = ['ABCA','ABAA','AAAA','CAAC','ABCB','CBCA'];
            var matrices = service.getMatrices(inData);
            expect(matrices['BLOSUMMatrix'][0]).toEqual([0,0,1]);
            expect(matrices['BLOSUMMatrix'][1]).toEqual([0,2,-5]);
            expect(matrices['BLOSUMMatrix'][2]).toEqual([1,-5,0]);
        });

        it('should compute BLOSUM matrix (ext)', function() {
            var inData = ['CCAAABAC','CCAABBAB','BBCACBAB','CBCACBAB','CCCABBAB','CCCBBBAB'];
            var matrices = service.getMatrices(inData);
            expect(matrices['BLOSUMMatrix'][0]).toEqual([3,-3,-2]);
            expect(matrices['BLOSUMMatrix'][1]).toEqual([-3,2,-1]);
            expect(matrices['BLOSUMMatrix'][2]).toEqual([-2,-1,2]);
        });

    });
});
