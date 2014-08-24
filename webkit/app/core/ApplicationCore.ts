/// <reference path="_reference.d.ts" />

angular.module('application', ['application.component', 'ngRoute' , 'ngLocale', 'ui', 'ui.router', 'ui.bootstrap']);
angular.module('application.component', []);

angular.module('application')
    .config([
        '$routeProvider', '$urlRouterProvider', '$locationProvider', ($routeProvider, $urlRouterProvider, $locationProvider) => {
            $locationProvider.html5Mode(false).hashPrefix();
            $urlRouterProvider.otherwise('/manager/index');
        }
    ])
    .config([
        '$stateProvider', ($stateProvider: any) => {
            $stateProvider
                .state('manager', {
                    url: '/manager',
                    abstract: true,
                    templateUrl: 'app/view/Manager.html'
                })
            .state('manager.index', {
                    url: '/index',
                    views: {
                        'content': {
                            templateUrl: 'app/part/manager/Index.html'
                        }
                    }
                })
            ;

        }
    ])
    .run(($rootScope: any) => {
        $rootScope.isApplicationRunning = true;
    });

