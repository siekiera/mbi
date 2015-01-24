var app = angular.module('blosumCalculatorApp', [
    'ngRoute',
    'blosumCalculatorControllers'
]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/seq_input', {
                templateUrl: 'partials/seq_input.html',
                controller: 'MainCtrl'
            }).
            when('/stage', {
                templateUrl: 'partials/stage.html',
                controller: 'StageCtrl'
            }).
            otherwise({
                redirectTo: '/seq_input'
            });
    }]);