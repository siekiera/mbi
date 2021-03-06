var app = angular.module('blosumComputer', ['sprintf']).service('BLOSUMService',
    function()
    {
        this.getMatrices = function(inData)
        {
            //helper functions
            var fillMatrix = function(matrix, fun) {
                for(var i=0;i<matrix.length;++i)
                {
                    for(var j=0;j<matrix[0].length;++j)
                    {
                        matrix[i][j] = fun(i,j);
                    }
                }
            };
            var getSquareMatrix = function(size) {
                var matrix = new Array(size);
                for (var i = 0; i < size; i++) {
                    matrix[i]= new Array(size);
                }
                return matrix;
            };

            var printFloat = function(value) {
                returnval = '';
                if (value==Number.NEGATIVE_INFINITY)
                    returnval = '-∞';
                else if (value==Number.NEGATIVE_INFINITY)
                    returnval = '∞';
                else
                    returnval = sprintf("%.2f",value);
                return returnval;
            }


            //return value
            matrices = {};
            matrices['error'] = false;

            //constants
            scope = {};
            scope.msgDifferentLength = 'Sekwencje mają różną długość!';
            scope.msgNoSequence = 'Nie podano wystarczającej liczby sekwencji,' +
                ' obliczenie macierzy BLOSUM nie jest możliwe!';
            scope.hintSubMatrix = 'Liczba podstawień symbolu \'%s\' na symbol \'%s\' dla kolejnych pozycji w sekwencjach: %s = %d';
            scope.hintSubMatrixElem ="%d";
            scope.hintSymMatrixElemDivider = ' + ';
            scope.hintProbMatrix = 'Suma komórek w macierzy podstawień: %d.' +
                ' Prawdopodobieństwo pary (%s,%s) to %d/%d = %.2f';
            scope.hintSymMatrix = 'Prawdopodobieństowo wystąpienia symbolu \'%s\': %s = %.2f';
            scope.hintSymMatrixElem = '%.2f';
            scope.hintSymMatrixElemDivider = ' + ';
            scope.hintEMatrix = 'Wartość elementu (%s,%s) w macierzy E wynosi 2*log2(%.2f/(%.2f*%.2f)) = %s';
            scope.hintBLOSUMMatrix = 'Wartość elementu (%s,%s) w macierzy BLOSUM to zaokrąglona do liczby ' +
            'całkowitej wartość %s, czyli %s';

            //start computation
            var sequences = inData;

            //compute alphabet, sequenceLength, alphabetSize, mapLetterInt
            var characterset = {};
            if (sequences == undefined || sequences.length <= 1) {
                matrices['errorMessage'] = scope.msgNoSequence;;
                matrices['error'] = true;
                return matrices;
            }
            var sequenceLength = sequences[0].length;
            sequences.forEach(function (sequence) {
                len = sequence.length;
                if (len != sequenceLength) {
                    matrices['errorMessage'] = scope.msgDifferentLength;
                    matrices['error'] = true;
                    return matrices;
                }
                for (var i = 0; i < len; i++) {
                    var symbol = sequence[i];
                    characterset[symbol] = true;
                }
            });
            var alphabet = Object.keys(characterset).sort();
            var alphabetSize = Object.keys(characterset).length;
            var mapLetterInt = {};
            for (var i = 0; i < alphabetSize; ++i) {
                mapLetterInt[alphabet[i]] = i;
            }


            //init substitutionMatrix
            var substitutionMatrix = getSquareMatrix(alphabetSize);
            var substitutionMatrixHint = getSquareMatrix(alphabetSize);
            var substitutionMatrixHintTemp = getSquareMatrix(alphabetSize);
            fillMatrix(substitutionMatrix, function (i, j) {
                return 0;
            });
            fillMatrix(substitutionMatrixHint, function (i, j) {
                return '';
            });

            //compute substitutionMatrix
            //TODO: effectiveness - 2x add instead of "add once and then mirror"
            for (var c = 0; c < sequenceLength; ++c) {
                fillMatrix(substitutionMatrixHintTemp, function (i, j) {return 0;});
                for (var i = 0; i < sequences.length; ++i) {
                    for (var j = i + 1; j < sequences.length; ++j) {
                        //for each sequence pair
                        sequence1 = sequences[i];
                        sequence2 = sequences[j];
                        letter1 = sequence1[c];
                        letter2 = sequence2[c];
                        index1 = mapLetterInt[letter1];
                        index2 = mapLetterInt[letter2];
                        substitutionMatrix[index1][index2] += 1;
                        substitutionMatrix[index2][index1] += 1;

                        substitutionMatrixHintTemp[index1][index2] += 1;
                        substitutionMatrixHintTemp[index2][index1] += 1;
                    }
                }

                for (var i = 0; i < alphabetSize; ++i) {
                    for (var j = 0; j < alphabetSize; ++j) {
                        substitutionMatrixHint[i][j] += sprintf(
                            scope.hintSubMatrixElem,substitutionMatrixHintTemp[i][j]) + scope.hintSymMatrixElemDivider;
                    }
                }
            }

            for (var i = 0; i < alphabetSize; ++i) {
                for (var j = 0; j < alphabetSize; ++j) {
                    var elems = substitutionMatrixHint[i][j].substring(0,substitutionMatrixHint[i][j].length - scope.hintSymMatrixElemDivider.length);
                    substitutionMatrixHint[i][j] = sprintf(scope.hintSubMatrix,
                        alphabet[i],alphabet[j],elems,substitutionMatrix[i][j]);
                }
            }

            //compute pairProbabilityMatrix
            var pairProbabilityMatrix = getSquareMatrix(alphabetSize);
            var pairProbabilityMatrixHint = getSquareMatrix(alphabetSize);
            //divider = amount of pairs * sequence length (number of substitutions) * 2 (every pair is counted twice)
            var divider = (sequences.length*(sequences.length-1)/2)*2*sequenceLength;
            fillMatrix(pairProbabilityMatrix,function(i,j){
                var value = substitutionMatrix[i][j]/divider;
                pairProbabilityMatrixHint[i][j] = sprintf(scope.hintProbMatrix,
                    divider,alphabet[i],alphabet[j], substitutionMatrix[i][j], divider, value);
                return value;
            });

            //compute symbolProbabilityMatrix
            var symbolProbabilityMatrix = new Array(alphabetSize);
            var symbolProbabilityMatrixHint = new Array(alphabetSize);
            for (var i=0;i<alphabetSize;++i)
            {
                symbolProbabilityMatrix[i] = pairProbabilityMatrix[i][i];
                var symbolHintString = sprintf(scope.hintSymMatrixElem,pairProbabilityMatrix[i][i])
                    + scope.hintSymMatrixElemDivider;
                for(var j=0;j<alphabetSize;++j)
                {
                    if (i==j) {
                        continue;
                    }
                    symbolProbabilityMatrix[i] += pairProbabilityMatrix[i][j];
                    symbolHintString += sprintf(scope.hintSymMatrixElem,pairProbabilityMatrix[i][j])
                    + scope.hintSymMatrixElemDivider;
                }
                symbolHintString = symbolHintString.substring(0,
                    symbolHintString.length-scope.hintSymMatrixElemDivider.length);
                symbolProbabilityMatrixHint[i] = sprintf(scope.hintSymMatrix,alphabet[i],symbolHintString,symbolProbabilityMatrix[i])
            }

            //compute eMatrix
            var eMatrix = getSquareMatrix(alphabetSize);
            var eMatrixHint = getSquareMatrix(alphabetSize);
            fillMatrix(eMatrix, function (i,j) {
                var value = 2*Math.log2(pairProbabilityMatrix[i][j]/(symbolProbabilityMatrix[i]*symbolProbabilityMatrix[j]));
                eMatrixHint[i][j] = sprintf(scope.hintEMatrix,
                    alphabet[i],alphabet[j],
                    pairProbabilityMatrix[i][j],symbolProbabilityMatrix[i],symbolProbabilityMatrix[j],
                    printFloat(value));
                return value;
            });

            //compute BLOSUMMatrix
            var BLOSUMMatrix = getSquareMatrix(alphabetSize);
            var BLOSUMMatrixHint = getSquareMatrix(alphabetSize);
            fillMatrix(BLOSUMMatrix, function (i,j) {
                BLOSUMMatrixHint[i][j] = sprintf(scope.hintBLOSUMMatrix,
                    alphabet[i],alphabet[j],
                    printFloat(eMatrix[i][j]),
                    (!isFinite(eMatrix[i][j]))
                        ?printFloat(eMatrix[i][j])
                        :printFloat(Math.round(eMatrix[i][j])));
                return Math.round(eMatrix[i][j]);
            });

            matrices['substitutionMatrix']= substitutionMatrix;
            matrices['pairProbabilityMatrix']= pairProbabilityMatrix;
            matrices['symbolProbabilityMatrix']= [symbolProbabilityMatrix];
            matrices['eMatrix']= eMatrix;
            matrices['BLOSUMMatrix']= BLOSUMMatrix;

            matrices['substitutionMatrixHint']= substitutionMatrixHint;
            matrices['pairProbabilityMatrixHint']= pairProbabilityMatrixHint;
            matrices['symbolProbabilityMatrixHint']= [symbolProbabilityMatrixHint];
            matrices['eMatrixHint']= eMatrixHint;
            matrices['BLOSUMMatrixHint']= BLOSUMMatrixHint;

            matrices['alphabet']= alphabet;
            matrices['alphabetSize']= alphabetSize;

            return matrices;
        }
    });

