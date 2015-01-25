uiInit = function () {
    $( "input[type=submit], a, button" ).button();
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

/**
 * Aktualizuje styl dla tabeli
 *
 * @param table
 */
function applyTableStyle(table) {
//style dla elementów tabelki
    table.find("th").each(function () {
        jQuery(this).addClass("ui-state-default");
    });
    table.find("td").each(function () {
        jQuery(this).addClass("ui-widget-content");
    });
    table.find("tr").hover(
        function () {
            jQuery(this).children("td").addClass("ui-state-hover");
        },
        function () {
            jQuery(this).children("td").removeClass("ui-state-hover");
        }
    ).click(function () {
            jQuery(this).children("td").toggleClass("ui-state-highlight");
        });
//linki wewnątrz tabelek zamieniamy na przyciski, ale z mniejszym marginesem
//zmieniamy tylko te linki, które nie są w li, objętym przez funkcję createMenuButton
    table.find("a").not("li a").button().find('.ui-button-text').css({'padding-top': '0', 'padding-bottom': '0'});
}