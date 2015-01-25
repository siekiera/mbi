uiInit = function () {
    $( "input[type=submit], a, button" ).button();
    $(".control-buttons").buttonset();
    var progressbar = $(".progressbar");
    progressbar.progressbar({
        value: 0
    });
    //applyTableStyle($(".matrix-table"));
    $(".dialog").dialog({
        autoOpen: false,
        buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
        }
    });
    $("#dialog-sequence").dialog({
        autoOpen: false,
        closeOnEscape: false,
        modal: true,
        open: function(event, ui) {
            //hide close button.
            $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
        }
    }).find("#button-calculate").click(function() {
        $("#dialog-sequence").dialog("close");
    });
};

uiUpdate = function(scope) {
    $("#stage-progressbar").progressbar("value", 25 * (scope.stageId - 1));
    $("#step-progressbar").progressbar("value", 100 * scope.currentStep / scope.stepCount);
    //applyTableStyle($(".matrix-table"));
};

showDialog = function(id) {
    $(id).dialog("open");
};

setCalculateButtonDisabled = function(disabled) {
    $("#button-calculate").button({
        disabled: disabled
    });
};