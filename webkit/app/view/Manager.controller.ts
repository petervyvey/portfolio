/// <reference path="../core/_reference.d.ts" />

module Application.View {

    export interface IManagerControllerScope {
        message: string;
    }

    export class ManagerController {
        static $inject = ['$scope'];

        constructor($scope: any) {
            this.$scope= this.$localScope = $scope;
        }

        private $scope: any;
        private $localScope: IManagerControllerScope;
    }
}

angular.module('application.component').controller('Application.View.ManagerController', Application.View.ManagerController);