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
            otherwise({
                redirectTo: '/seq_input'
            });
    }]);