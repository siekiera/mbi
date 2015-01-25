'use strict';

var controllers = angular.module('blosumCalculatorControllers',['blosumComputer']);

controllers.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.inputSequence = '';
    $scope.sequences = [];
    $scope.$parent.sequences = $scope.sequences;
    $scope.sequenceLength = 0;
    $scope.addSequence = function() {
        // Perform verification to avoid sequences of different length and empty
        if ($scope.inputSequence.length == 0) return;
        if ($scope.sequences.length == 0) {
            $scope.sequenceLength = $scope.inputSequence.length;
        } else if ($scope.sequenceLength != $scope.inputSequence.length) {
            showDialog("#dialog-incorrect-size");
            return;
        }
        // Add
        $scope.sequences.push($scope.inputSequence);
        if ($scope.sequences.length > 1) {
            setCalculateButtonDisabled(false);
        }
    };
    $scope.removeSequence = function(index) {
        $scope.sequences.splice(index, 1);
        if ($scope.sequences.length <= 1) {
            setCalculateButtonDisabled(true);
        }
    };
    $scope.$on('$viewContentLoaded', function() {
        uiInit();
        setCalculateButtonDisabled(true);
        showDialog("#dialog-sequence");
    });

}]);

controllers.controller('StageCtrl', function ($scope,$location,$route, BLOSUMService) {
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
    $scope.stageName = '';
    $scope.showImage = false;
    $scope.alphabet = $scope.algoResults.alphabet;
    $scope.uiMatrices = {
        substitution: {
            matrix: $scope.algoResults.substitutionMatrix,
            hints: $scope.algoResults.substitutionMatrixHint,
            description: 'Macierz podstawień'
        },
        q_pair_prob_est: {
            matrix: $scope.algoResults.pairProbabilityMatrix,
            hints: $scope.algoResults.pairProbabilityMatrixHint,
            description: 'Macierz estymacji prawdopodobieństw par q(i,j)'
        },
        p_symbol_pair_matrix: {
            matrix: $scope.algoResults.symbolProbabilityMatrix,
            hints: $scope.algoResults.symbolProbabilityMatrixHint,
            specialRowsNames: ['p(i,j)'],
            description: 'Macierz prawdopodobieństw symboli p(i,j)'
        },
        e_matrix: {
            matrix: $scope.algoResults.eMatrix,
            hints: $scope.algoResults.eMatrixHint,
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
                $scope.stageName = 'Obliczanie macierzy podstawień';
                $scope.showImage = false;
                break;
            case 2:
                $scope.uiMatricesOnLeft = [$scope.uiMatrices.substitution];
                $scope.uiMatrixOnRight = $scope.uiMatrices.q_pair_prob_est;
                $scope.stageName = 'Estymacja prawdopodobieństwa pary q(i,j)';
                $scope.showImage = true;
                break;
            case 3:
                $scope.uiMatricesOnLeft = [$scope.uiMatrices.substitution, $scope.uiMatrices.q_pair_prob_est];
                $scope.uiMatrixOnRight = $scope.uiMatrices.p_symbol_pair_matrix;
                $scope.stageName = 'Obliczanie prawdopodobieństw symboli p(i)';
                $scope.showImage = true;
                break;
            case 4:
                $scope.uiMatricesOnLeft = [$scope.uiMatrices.q_pair_prob_est, $scope.uiMatrices.p_symbol_pair_matrix];
                $scope.uiMatrixOnRight = $scope.uiMatrices.e_matrix;
                $scope.stageName = 'Obliczanie macierzy e(i,j)';
                $scope.showImage = true;
                break;
            case 5:
                $scope.uiMatricesOnLeft = [$scope.uiMatrices.e_matrix];
                $scope.uiMatrixOnRight = $scope.uiMatrices.blosum_matrix;
                $scope.stageName = 'Obliczanie macierzy BLOSUM';
                $scope.showImage = false;
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
            uiUpdate($scope);
        } else if ($scope.stageId == 5) {
            $scope.currentStep = $scope.stepCount;
            uiUpdate($scope);
        }
    };
    $scope.prevStage = function() {
        if ($scope.stageId > 1) {
            $scope.stageId--;
            $scope.loadStage();
            $scope.currentStep = $scope.stepCount;
            uiUpdate($scope);
        }
    };
    $scope.nextStep = function() {
        if ($scope.currentStep < $scope.stepCount ) {
            $scope.currentStep++;
            uiUpdate($scope);
        }
    };
    $scope.prevStep = function() {
        if ($scope.currentStep > 0 ) {
            $scope.currentStep--;
            uiUpdate($scope);
        }
    };
    $scope.changeSeqs = function() {
        window.location.reload();
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
    $scope.writeNumber = function (num) {
        if (num == Infinity) {
            return '∞';
        }
        if (num == -Infinity) {
            return '-∞';
        }
        return Math.round(num * 100) / 100;
    };


    //
    //$scope.updateUI = function(oldValue, newValue) {
    //    uiUpdate($scope);
    //};
    //$scope.watch('stageId', $scope.updateUI);



    // initialization
    $scope.loadStage();
    $scope.$on('$viewContentLoaded', uiInit);

});