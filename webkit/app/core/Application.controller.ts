/// <reference path="_reference.d.ts" />

import nw_gui = require('nw.gui');

module Application {
    export interface IApplicationControllerScope extends ng.IRootScopeService {
        applicationExit: () => void;
    }

    export class ApplicationController {
        static $inject = ['$scope', '$window', '$timeout', '$http'];

        constructor($scope: any, $window: ng.IWindowService, $timeout: ng.ITimeoutService, $http: ng.IHttpService) {
            this.$scope = this.$localScope = $scope;
            this.$window = $window;
            this.$timeout = $timeout;
            this.$http = $http;

            this.initializeScope();
        }

        private $scope: any;
        private $localScope: IApplicationControllerScope;
        private $window: ng.IWindowService;
        private $timeout: ng.ITimeoutService;
        private $http: ng.IHttpService;

        private initializeScope(): void {
            this.$localScope.applicationExit = (): void => {
                this.$timeout(()=>{
                    var nw_window: nw_gui.Window = nw_gui.Window.get();
                    nw_window.close();
                }, 300);
            };
        }
    }
}

angular.module('application.component').controller('Application.ApplicationController', Application.ApplicationController);
