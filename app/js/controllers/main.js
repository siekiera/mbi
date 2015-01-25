'use strict';

var controllers = angular.module('blosumCalculatorControllers',['blosumComputer']);

controllers.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.text = 'Hello world!';
    $scope.inputSequence = '';
    $scope.sequences = [];
    $scope.addSequence = function() {
        $scope.sequences.push($scope.inputSequence);
        $scope.$parent.sequences = $scope.sequences;
    };
    $scope.$on('$viewContentLoaded', uiInit);

}]);

controllers.controller('StageCtrl', function ($scope,$location,BLOSUMService) {
    $scope.stageId = 1;
    $scope.sequences = $scope.$parent.sequences;
    console.log($scope.sequences);
    $scope.algoResults = BLOSUMService.getMatrices($scope.sequences);
    if($scope.algoResults == undefined || $scope.algoResults.error)
    {
        $location.path('/');
    }
    $scope.content = [];
    $scope.currentStep = 0;
    $scope.alphabet = $scope.algoResults.alphabet;
    $scope.uiMatrices = {
        substitution: {
            matrix: $scope.algoResults.substitutionMatrix,
            hints: $scope.algoResults.substitutionMatrixHint,
            visible: false,
            description: 'Macierz podstawień'
        },
        q_pair_prob_est: {
            matrix: $scope.algoResults.pairProbabilityMatrix,
            hints: $scope.algoResults.pairProbabilityMatrixHint,
            visible: false,
            description: 'Macierz estymacji prawdopodobieństw par q_i_j'
        },
        p_symbol_pair_matrix: {
            matrix: $scope.algoResults.symbolProbabilityMatrix,
            hints: $scope.algoResults.symbolProbabilityMatrixHint,
            specialRowsNames: ['p_ij'],
            description: 'Macierz prawdopodobieństw symboli p_i_j'
        },
        e_matrix: {
            matrix: $scope.algoResults.eMatrix,
            hints: $scope.algoResults.eMatrixHint,
            visible: false,
            description: 'Macierz E'
        },
        blosum_matrix: {
            matrix: $scope.algoResults.BLOSUMMatrix,
            hints: $scope.algoResults.BLOSUMMatrixHint,
            description: 'Macierz BLOSUM'
        }
    };

    $scope.uiMatricesOnLeft = [];
    $scope.uiMatrixOnRight = null;
    $scope.uiMatrixOnRightWidth = 0;
    $scope.stepCount = 0;
    $scope.colsNames = $scope.alphabet;
    $scope.rightRowsNames = [];

    $scope.loadStage = function() {
        switch ($scope.stageId) {
            case 1:
                $scope.uiMatricesOnLeft = [];
                $scope.uiMatrixOnRight = $scope.uiMatrices.substitution;
                break;
            case 2:
                $scope.uiMatricesOnLeft = [$scope.uiMatrices.substitution];
                $scope.uiMatrixOnRight = $scope.uiMatrices.q_pair_prob_est;
                break;
            case 3:
                $scope.uiMatricesOnLeft = [$scope.uiMatrices.substitution, $scope.uiMatrices.q_pair_prob_est];
                $scope.uiMatrixOnRight = $scope.uiMatrices.p_symbol_pair_matrix;
                break;
            case 4:
                $scope.uiMatricesOnLeft = [$scope.uiMatrices.q_pair_prob_est, $scope.uiMatrices.p_symbol_pair_matrix];
                $scope.uiMatrixOnRight = $scope.uiMatrices.e_matrix;
                break;
            case 5:
                $scope.uiMatricesOnLeft = [$scope.uiMatrices.e_matrix];
                $scope.uiMatrixOnRight = $scope.uiMatrices.blosum_matrix;
                break;
        }
        $scope.rightRowsNames = $scope.getRowsNames($scope.uiMatrixOnRight);
        $scope.uiMatrixOnRightWidth = $scope.uiMatrixOnRight.matrix.length > 0 ? $scope.uiMatrixOnRight.matrix[0].length : 0;
        $scope.stepCount = $scope.uiMatrixOnRight.matrix.length * $scope.uiMatrixOnRightWidth;
    };

    $scope.nextStage = function() {
        if ($scope.stageId < 5) {
            $scope.stageId++;
            $scope.loadStage();
            $scope.currentStep = 0;
        }
    };
    $scope.prevStage = function() {
        if ($scope.stageId > 1) {
            $scope.stageId--;
            $scope.loadStage();
            $scope.currentStep = $scope.stepCount;
        }
    };
    $scope.nextStep = function() {
        if ($scope.currentStep < $scope.stepCount ) {
            $scope.currentStep++;
        }
    };
    $scope.prevStep = function() {
        if ($scope.currentStep > 0 ) {
            $scope.currentStep--;
        }
    };

    $scope.rowsInCurrentStep = function () {
        return Math.ceil($scope.currentStep / $scope.uiMatrixOnRightWidth);
    };
    $scope.colsInLastRow = function() {
        var cols =  $scope.currentStep % $scope.uiMatrixOnRightWidth;
        if (cols == 0) {
            cols = $scope.uiMatrixOnRightWidth;
        }
        return cols;
    };
    $scope.getRowsNames = function(uiMatrix) {
        return (uiMatrix.specialRowsNames !== undefined) ? uiMatrix.specialRowsNames : $scope.alphabet;
    };



    // initialization
    $scope.loadStage();
    $scope.$on('$viewContentLoaded', uiInit);

});