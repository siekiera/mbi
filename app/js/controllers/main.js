'use strict';

var controllers = angular.module('blosumCalculatorControllers', []);

controllers.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.text = 'Hello world!';
    $scope.inputSequence = '';
    $scope.sequences = [];
    $scope.addSequence = function() {
        $scope.sequences.push($scope.inputSequence);
        $scope.$parent.sequences = $scope.sequences;
    };

}]);

controllers.controller('StageCtrl', ['$scope', function ($scope) {
    $scope.stageId = 1;
    $scope.sequences = $scope.$parent.sequences;
    $scope.content = [];
    $scope.currentStep = 0;
    $scope.matrices = {
        // FIXME:: Mock - should be received from the algorithm
        substitution_matrix: [[1, 2, 2], [4, 5, 6], [7,8 , 9]],
        q_pair_prob_est_matrix: [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6], [0.7, 0.8, 0.9]],
        p_symbol_pair_matrix: [[0.1, 0.2, 0.3]],
        e_matrix: [[-1, -2, -3], [-3, -4, 2.4]],
        blosum_matrix: [[9, 8, 7], [6, 5, 3], [2, 1, 0]]
    };
    $scope.alphabet = ['A', 'B', 'C'];
    $scope.uiMatrices = {
        substitution: {
            matrix: $scope.matrices.substitution_matrix,
            visible: false,
            description: 'Macierz podstawień'
        },
        q_pair_prob_est: {
            matrix: $scope.matrices.q_pair_prob_est_matrix,
            visible: false,
            description: 'Macierz estymacji prawdopodobieństw par q_i_j'
        },
        p_symbol_pair_matrix: {
            matrix: $scope.matrices.p_symbol_pair_matrix,
            specialRowsNames: ['p_ij'],
            description: 'Macierz prawdopodobieństw symboli p_i_j'
        },
        e_matrix: {
            matrix: $scope.matrices.e_matrix,
            visible: false,
            description: 'Macierz E'
        },
        blosum_matrix: {
            matrix: $scope.matrices.blosum_matrix,
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

}]);