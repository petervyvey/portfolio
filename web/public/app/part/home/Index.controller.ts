﻿/// <reference path="../../core/_reference.d.ts" />

module Application.Part.Home {

    export class Menu {
        public items: Array<MenuItem> = new Array<MenuItem>();

        public addItem(item: MenuItem): MenuItem {
            this.items.push(item);

            return item;
        }

        public activateItem(item: MenuItem): void {
            this.items.forEach((x: MenuItem)=>{ x.isActive = false; });
            item.isActive = true;
        }
    }

    export class MenuItem {

        constructor(title: string, isActive?: boolean){
            this.title = title;
            if (isActive) {
                this.isActive = isActive;
            }
        }

        public isActive: boolean = false;
        public title: string = '';
    }

    export class Gallery {
        public title: string = '';
        public description: string = '';
        public coverPicture: string = '';
        public pictures : Array<Picture> = new Array<Picture>();
    }

    export class Picture {
        public title: string = '';
        public description: string = '';
        public fileName: string = '';
    }
    
    export interface IIndexControllerScope extends ng.IRootScopeService {
        menu: Menu;
        galleries: Array<Gallery>;
        activateMenuItem(item: MenuItem);
    }

    export class IndexControllerScope {
        static $inject = ['$scope', '$window', '$http'];

        constructor($scope: any, $window: ng.IWindowService, $http: ng.IHttpService) {
            this.$scope = this.$localScope = $scope;
            this.$window = $window;
            this.$http = $http;

            this.initializeScope();
            this.initializeData();
            this.attachEvents();
            this.onResize();
        }

        private $scope: any;
        private $localScope: IIndexControllerScope;
        private $window: ng.IWindowService;
        private $http: ng.IHttpService;

        private menu: Menu;

        private initializeScope(): void {
            this.$localScope.menu = new Menu();
            this.$localScope.menu.addItem(new MenuItem('About', true));
            this.$localScope.menu.addItem(new MenuItem('Portfolio'));
            this.$localScope.menu.addItem(new MenuItem('Services'));
            this.$localScope.menu.addItem(new MenuItem('Contact'));

            this.$localScope.galleries = new Array<Gallery>();

            this.$localScope.$on('$routeChangeSuccess', function(event, current) {
                (<any>$('#fullpage')).fullpage();
            });

            this.$localScope.activateMenuItem = (item: MenuItem): void => {
                var indexRel: number = -1;
                for(var i: number=0; i < this.$localScope.menu.items.length; i++) {
                    if (this.$localScope.menu.items[i].isActive) {
                        indexRel = i;
                    }
                }

                var indexNew: number = this.$localScope.menu.items.indexOf(item);
                $.fn.fullpage.moveTo((indexNew + 1) % this.$localScope.menu.items.length, 0);
                this.$localScope.menu.activateItem(item);
            };
        }

        private initializeData(): void {
            this.$http({method: 'GET', url: '/app/media/gallery/gallery.json'}).
                success((data, status, headers, config) => {
                    this.$localScope.galleries = data;
                    console.log(this.$localScope.galleries);
                }).
                error((error, status, headers, config) => {
                    this.$localScope.galleries.splice(0, this.$localScope.galleries.length);
                });
        }

        private attachEvents(): void {
            angular.element(this.$window).on('resize', this.onResize);
        }

        private onResize(event?: JQueryEventObject):void {
        }
    }
}

angular.module('application.component').controller('Application.Part.Home.IndexControllerScope', Application.Part.Home.IndexControllerScope);