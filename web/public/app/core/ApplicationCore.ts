/// <reference path="_reference.d.ts" />

angular.module('application', ['application.component', 'ngRoute' , 'ngLocale', 'ui.bootstrap']);
angular.module('application.component', []);

angular.module('application')
    .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
        $locationProvider.html5Mode(false).hashPrefix();
        $routeProvider
            .when('/',
            {
                templateUrl: 'app/part/home/Index.html'
            })
            .otherwise({
                redirectTo: '/'
            })
        ;
    }])
    .run(($rootScope: any) => {
        
    });

