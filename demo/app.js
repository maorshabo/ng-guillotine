(function(){
    'use strict';

    angular.module('angular-guillotine-demo', [
        'ngRoute',
        'ngGuillotine'
    ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'main/main.html',
                    controller: 'MainCtrl as mainCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });
})();