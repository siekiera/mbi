var app = angular.module('blosumCalculatorAppDumbComputer', ['blosumComputer']);


app.controller('DumbCtrl', function ($scope,BLOSUMService) {
    $scope.fun = function(inData)
    {
        return BLOSUMService.getMatrices(inData);
    }

});