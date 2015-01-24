var app = angular.module('blosumCalculatorAppComputer', []);

//MACIERZ TO: [WIERSZ,KOLUMNA] - normlna macierz jest PIONOWA
// Alphabet = all possible symbols
// substitutionMatrix - first

app.controller('BLOSUMCtrl', function ($scope) {
    $scope.inData = [];
    $scope.inComputationStart = false;
    $scope.outAlphabetSize = 0;
    $scope.outSubstitutionMatrix = [];
    $scope.outPairProbabilityMatrix = [];
    $scope.outSymbolProbabilityMatrix = [];
    $scope.outEMatrix = [];
    $scope.outBLOSOMMatrix = [];
    $scope.outFinished = false;
    $scope.outError = false;
    $scope.outErrorMessage = '';
    $scope.msgDifferentLength = 'Sequences of different length!';
    $scope.msgNoSequence = '0 sequences provided, BLOSUM matrix computation impossible!';

    $scope.$watch('inComputationStart',function(newValue,oldValue) {
        $scope.outError = false;

        var characterset = {};
        var sequences = $scope.inData;
        if(sequences.length <= 0)
        {
            $scope.outErrorMessage = $scope.msgNoSequence;
            $scope.outError = true;
            return;
        }
        var sequenceLength = sequences[0].length;

        sequences.forEach(function(sequence) {
            len = sequence.length;
            if(len != sequenceLength)
            {
                $scope.outErrorMessage = $scope.msgDifferentLength;
                $scope.outError = true;
                return;
            }
            for (var i = 0; i < len; i++) {
                var symbol = sequence[i];
                characterset[symbol]=true;
            }
        });

        var alphabet = Object.keys(characterset).sort();
        var alphabetSize = Object.keys(characterset).length;
        var mapLetterInt = {};

        for(var i=0;i<alphabetSize;++i)
        {
            mapLetterInt[alphabet[i]]=i;
        }

        //init substitutionMatrix
        var substitutionMatrix = [];
        for (var i = 0; i < alphabetSize; i++) {
            var subarray = [];
            for (var j = 0; j < alphabetSize; j++) {
                subarray.push(0);
            }
            substitutionMatrix.push(subarray);
        }

        //compute substitutionMatrix
        //TODO: effectiveness - 2x add instead of "add once and then mirror"
        for (var i=0; i<sequences.length; ++i)
        {
            for (var j=i+1; j<sequences.length; ++j)
            {
                //for each sequence pair
                sequence1 = sequences[i];
                sequence2 = sequences[j];
                for (var c=0;c<sequenceLength;++c)
                {
                    letter1 = sequence1[c];
                    letter2 = sequence2[c];
                    index1 = mapLetterInt[letter1];
                    index2 = mapLetterInt[letter2];
                    substitutionMatrix[index1][index2] += 1;
                    substitutionMatrix[index2][index1] += 1;
                }
            }
        }

        $scope.outSubstitutionMatrix = substitutionMatrix;
        $scope.outAlphabetSize = alphabetSize;
        $scope.outFinished = true;
    });

});