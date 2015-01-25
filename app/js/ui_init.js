uiInit = function () {
    $( "input[type=submit], a, button" ).button();
    $(".control-buttons").buttonset();
    var progressbar = $(".progressbar");
    progressbar.progressbar({
        value: 0
    });
    //applyTableStyle($(".matrix-table"));
};

uiUpdate = function(scope) {
    $("#stage-progressbar").progressbar("value", 25 * (scope.stageId - 1));
    $("#step-progressbar").progressbar("value", 100 * scope.currentStep / scope.stepCount);
    //applyTableStyle($(".matrix-table"));
};
