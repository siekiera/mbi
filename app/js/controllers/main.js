'use strict';

var controllers = angular.module('blosumCalculatorControllers', []);

controllers.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.text = 'Hello world!';
    $scope.inputSequence = '';
    $scope.sequences = [];
    $scope.addSequence = function() {
        $scope.sequences.push($scope.inputSequence);
    };
}]);