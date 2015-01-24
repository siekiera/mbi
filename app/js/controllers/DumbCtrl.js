var app = angular.module('blosumCalculatorAppDumbComputer', []);


app.controller('DumbCtrl', function ($scope) {
    $scope.inData = ['ABC','BBC','CBB'];
    $scope.inComputationStart = false;
    $scope.outAlphabetSize = 0;
    $scope.outSubstitutionMatrix = [];
    $scope.outPairProbabilityMatrix = [];
    $scope.outSymbolProbabilityMatrix = [];
    $scope.outEMatrix = [];
    $scope.outBLOSOMMatrix = [];
    $scope.outError = false;
    $scope.outErrorMessage = '';
    $scope.outFinished = false;


    $scope.$watch('inComputationStart',function(newValue,oldValue) {
        $scope.outSubstitutionMatrix = [[0,1,1],[1,6,3],[1,3,2]];
        $scope.outPairProbabilityMatrix = [[0,0.056,0.056],[0.056,0.333,0.167],[0.056,0.167,0.111]];
        $scope.outSymbolProbabilityMatrix = [0.112,0.556,0.334];
        $scope.outEMatrix = [[0,-0.306,1.164],[-0.306,0.215,-0.306],[1.164,-0.306,-0.014]];
        $scope.outBLOSOMMatrix = [[0,0,1],[0,0,0],[1,0,0]];
        $scope.outAlphabetSize = 3;
        $scope.outFinished = true;
    });

});