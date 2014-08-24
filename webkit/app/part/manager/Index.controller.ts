/// <reference path="../../core/_reference.d.ts" />

module Application.Part.Home {

    export interface IIndexControllerScope extends ng.IRootScopeService {
        galleryCursor: ArangoDB.CursorResponse;
    }

    export class IndexController {
        static $inject = ['$scope', '$window', '$timeout', '$http', 'arango'];

        constructor($scope: any, $window: ng.IWindowService, $timeout: ng.ITimeoutService, $http: ng.IHttpService, arango: ArangoDB.ArangoService) {
            this.$scope = this.$localScope = $scope;
            this.$window = $window;
            this.$timeout = $timeout;
            this.$http = $http;
            this.arango = arango;

            this.initializeScope();
        }

        private $scope:any;
        private $localScope: IIndexControllerScope;
        private $window: ng.IWindowService;
        private $timeout: ng.ITimeoutService;
        private $http: ng.IHttpService;
        private arango: ArangoDB.ArangoService;

        private initializeScope():void {
            var database: ArangoDB.Database = this.arango.open({user: 'web', password: 'linux', database: 'Portfolio'});
//            database.document.createDocument('Gallery', { id: Application.Utils.Guid.NewGuid(), name: 'People'}, new Application.Data.Store.DocumentOptions(false, false))
//                .then((result: any) => {
//                    console.log(result);
//                });

            var documentID: string;
            database.document.getDocument(new ArangoDB.DocumentHandle('Gallery', '22164532723'))
                .then((result:any) => {
                    console.log(angular.toJson(result, true));
                    documentID = ArangoDB.ObjectId.ToObjectID(result)._id;
                    console.log('object id: ', documentID);

                    database.document.updateDocument(ArangoDB.DocumentHandle.Parse(documentID), { id: Application.Utils.Guid.NewGuid(), name:'Nature', description: null, timestamp: (new Date()).toISOString() })
                        .then((result:any) => {
                            console.log('updated: ', angular.toJson(result, true));
                        });
                });

            database.document.getDocumentList('Gallery')
                .then((response: ArangoDB.DocumentListResponse) => {
                    console.log(angular.toJson(response, true));
                });

            database.query.execute('FOR i IN Gallery RETURN i')
                .then((response: ArangoDB.QueryResponse) => {
                    console.log(angular.toJson(response, true));
                });

            database.cursor.execute({ query: 'FOR i IN Gallery RETURN i', count: true, batchSize: 4 })
                .then((response: ArangoDB.CursorResponse) => {
                    this.$localScope.galleryCursor = response;
                });

            database.simple.first('Gallery')
                .then((response: ArangoDB.CursorResponse) => {
                    console.log(angular.toJson(response, true));
                });

            database.simple.byExample('Gallery', { name: 'Nature' })
                .then((response: ArangoDB.CursorResponse) => {
                    console.log(angular.toJson(response, true));
                });

            database.edges.getEdges('GalleryPicture', new ArangoDB.EdgesOptions(new ArangoDB.DocumentHandle('Gallery', '22170299891'), ArangoDB.EdgeDirection.IN))
                .then((response:any) => {
                    console.log(angular.toJson(response, true));
                });
        }
    }
}

angular.module('application.component').controller('Application.Part.Home.IndexController', Application.Part.Home.IndexController);