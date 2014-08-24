/// <reference path="../../../core/_reference.d.ts" />

module ArangoDB {

    export class ArangoServiceProvider implements ng.IServiceProvider {
        public $get: any = ['$http', '$q', ($http: ng.IHttpService, $q: ng.IQService) => {
            return new ArangoService($http, $q);
        }]
    }

    export class ArangoService {

        constructor($http: ng.IHttpService, $q: ng.IQService) {
            this.$http = $http;
            this.$q = $q;
        }

        public $http: ng.IHttpService;
        public $q: ng.IQService;

        public open(options: IConnectionOptions): Database {
            return Database.Open(this.$http, this.$q, options);
        }
    }

    export class ObjectId {
        public _id: string;
        public _rev: string;
        public _key: string;

        public static ToObjectID(instance: any): ObjectId {
            return angular.extend(new ObjectId(), instance);
        }
    }

    export class ApiResponse {
        public error: boolean = false;
        public code: number = null;
        public errorNum: number = null;
        public errorMessage: string = null;
    }

    export class OptionsBase {

        public toParameters(): string {
            return Object.keys(this).reduce((previous: string, current: string, c: number) => {
                var parameter: string = current + '=' + this[current];
                return !previous ? '?' + parameter : previous + '&' + parameter;
            }, '');
        }
    }

    export class Database {

        constructor(connection: Connection){
            this.connection = connection;

            this.cursor = new Cursor(this.connection);
            this.document = new Document(this.connection);
            this.edge = new Edge(this.connection);
            this.edges = new Edges(this.connection);
            this.query = new Query(this.connection);
            this.simple = new Simple(this.connection);
        }

        public static Open($http: ng.IHttpService, $q: ng.IQService, options: IConnectionOptions): Database {
            var connection: Connection = Connection.Open($http, $q, ConnectionOptions.Create(options));
            var instance: Database = new Database(connection);

            return instance;
        }

        public connection: Connection;
        public cursor: Cursor;
        public document: Document;
        public edge: Edge;
        public edges: Edges;
        public query: Query;
        public simple: Simple;
    }

    export interface IConnectionOptions {
        protocol?: string;
        address?: string;
        port?: string;
        user?: string;
        password?: string;
        database?: string;
    }

    export class ConnectionOptions implements IConnectionOptions {

        constructor(protocol: string, address: string, port: string, user: string, password: string, database: string) {
            this.protocol = protocol ? protocol : this.protocol;
            this.address = address ? address : this.address;
            this.port = port ? port : this.port;
            this.user = user ? user : this.user;
            this.password = password ? password : this.password;
            this.database = database ? database : this.database;
        }

        public protocol: string = 'http';
        public address: string = 'localhost';
        public port: string = '8529';
        public user: string = '';
        public password : string = '';
        public database: string = '';

        public static Create(options: IConnectionOptions): ConnectionOptions {
            var instance: ConnectionOptions = new ConnectionOptions(options.protocol, options.address, options.port, options.user, options.password, options.database);

            return instance;
        }

        public getServerUrl(): string {
            return this.protocol + '://' + this.user + ':' + this.password + '@' + this.address + ':' + this.port + '/_db/' + this.database + '/';
        }
    }

    export class Connection {

        constructor($http:ng.IHttpService, $q:ng.IQService, serverUrl?:string) {
            this.$http = $http;
            this.$q = $q;

            this.serverUrl = serverUrl;
        }

        public static Open($http:ng.IHttpService, $q:ng.IQService, options:ConnectionOptions):Connection {
            var serverUrl:string = options.getServerUrl();
            var instance:Connection = new Connection($http, $q, serverUrl);

            return instance;
        }

        private $http:ng.IHttpService;
        public $q:ng.IQService;
        public serverUrl:string;

        public getRequest<TResult>(path: string): ng.IPromise<TResult> {
            var url: string = this.serverUrl + path;
            var deferred: ng.IDeferred<any> = this.$q.defer();

            this.$http.get(url)
                .success((response: any) => {
                    deferred.resolve(response);
                })
                .error((error: any) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        public postRequest<TResult>(path: string, data: any): ng.IPromise<TResult> {
            var url: string = this.serverUrl + path;
            var deferred: ng.IDeferred<any> = this.$q.defer();

            this.$http.post(url, data)
                .success((response: TResult) => {
                    deferred.resolve(response);
                })
                .error((error: any) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        public putRequest<TResult>(path: string, data: any): ng.IPromise<TResult> {
            var url: string = this.serverUrl + path;
            var deferred: ng.IDeferred<any> = this.$q.defer();

            this.$http.put(url, data)
                .success((response: TResult) => {
                    deferred.resolve(response);
                })
                .error((error: any) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        public patchRequest<TResult>(path: string, data: any): ng.IPromise<TResult> {
            var url: string = this.serverUrl + path;
            var deferred: ng.IDeferred<any> = this.$q.defer();

            this.$http.patch<TResult>(url, data)
                .success((response: TResult) => {
                    deferred.resolve(response);
                })
                .error((error: any) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    }

    export interface ICursorRequest {
        query?: string;
        count?: boolean;
        batchSize?: number;
        ttl?: number;
        bindVars?: any;
        options?: CursorOptions;
    }

    export class CursorRequest {

        constructor(query: string, count: boolean, batchSize: number, ttl: number, bindVars: any, options: CursorOptions) {
            this.query = query ? query : this.query;
            this.count = count ? count  : this.count;
            this.batchSize = batchSize ? batchSize : this.batchSize;
            this.ttl = ttl ? ttl : this.ttl;
            this.bindVars = bindVars ? bindVars : this.bindVars;
            this.options = options ? options : this.options;
        }

        public query: string;
        public count: boolean = false;
        public batchSize: number = null;
        public ttl: number = null;
        public bindVars: any = null;
        public options: CursorOptions = null;

        public static Create(request: ICursorRequest): CursorRequest {
            var instance: CursorRequest = new CursorRequest(request.query, request.count, request.batchSize, request.ttl, request.bindVars, request.options);
            return instance;
        }
    }

    export class CursorOptions {
        fullCount: boolean = false;
    }

    export class CursorResponse extends ApiResponse {
        public id: string = null;
        public result: any = null;
        public hasMore: boolean = false;
        public count: number = 0;
        public extra: any = null;
    }

    export class Cursor {

        constructor(connection: Connection){
            this.connection = connection;
        }

        public static PATH: string = '_api/cursor';

        public connection: Connection;

        public execute(request: ICursorRequest): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            var _request: CursorRequest = CursorRequest.Create(request);

            this.connection.postRequest(Cursor.PATH, _request)
                .then((response: CursorResponse) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }
    }

    export class DocumentOptions extends OptionsBase {

        constructor(createCollection?: boolean, waitForSync?: boolean) {
            super();

            this.createCollection= createCollection ? createCollection : false;
            this.waitForSync = waitForSync ? waitForSync : false;
        }

        public collection: string = '';
        public createCollection: boolean = false;
        public waitForSync: boolean = false;
    }

    export class DocumentListResponse {
        public documents: Array<string>;
    }

    export class DocumentHandle {
        constructor(collection: string, key: string) {
            this.collection = collection;
            this.key = key;
        }

        public collection: string;
        public key: string;

        public static Parse(id: string): DocumentHandle {
            if (!id) return null;

            var parts: Array<string> = id.split('/');
            if (parts.length!=2) throw Error('BAD DOCUMENT HANDLE');

            var documentHandle: DocumentHandle = new DocumentHandle(parts[0], parts[1]);

            return documentHandle;
        }

        public toString(): string {
            return this.collection + '/' + this.key;
        }
    }

    export class Document {

        constructor(connection: Connection){
            this.connection = connection;
        }

        public static PATH: string = '_api/document';

        public connection: Connection;

        public createDocument(collection: string, document: any, options?: DocumentOptions): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            if (!options){
                options = new DocumentOptions();
            }
            options.collection = collection;
            var parameters: string = options.toParameters();

            this.connection.postRequest(Document.PATH + parameters, document)
                .then((response: any) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }

        public getDocument(documentHandle: DocumentHandle): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            this.connection.getRequest(Document.PATH + '/' + documentHandle.toString())
                .then((response: any) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }

        public storeDocument(documentHandle: DocumentHandle, data: any) {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            this.connection.putRequest(Document.PATH + '/' + documentHandle.toString(), data)
                .then((response: any) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }

        public updateDocument(documentHandle: DocumentHandle, data: any) {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            this.connection.patchRequest(Document.PATH + '/' + documentHandle.toString(), data)
                .then((response: any) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }

        public getDocumentList(collection: string): ng.IPromise<DocumentListResponse> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            var options = new DocumentOptions();
            options.collection = collection;
            var parameters: string = options.toParameters();

            this.connection.getRequest(Document.PATH + parameters)
                .then((response: DocumentListResponse) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }
    }


    export class Edge {
        constructor(connection: Connection){
            this.connection = connection;
        }

        public static PATH: string = '_api/edge';

        public connection: Connection;
    }

    export enum EdgeDirection {
        IN = <any>'in',
        OUT = <any>'out',
    }

    export class EdgesOptions extends OptionsBase {

        constructor(vertex?: DocumentHandle, direction?: EdgeDirection) {
            super();

            this.vertex = vertex ? vertex.toString() : null;
            this.direction = direction ? direction : null;
        }

        public vertex: string;
        public direction: EdgeDirection;
    }

    export class EdgesResponse extends ApiResponse {
        edges: Array<EdgesItem>;
    }

    export class EdgesItem extends ObjectId {
        public _from: string;
        public _to: string;
    }

    export class Edges {
        constructor(connection: Connection){
            this.connection = connection;
        }

        public static PATH: string = '_api/edges';

        public connection: Connection;

        public getEdges(collection: string, options: EdgesOptions): ng.IPromise<EdgesResponse> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            if (!options){
                options = new EdgesOptions();
            }
            var parameters: string = options.toParameters();

            this.connection.getRequest(Edges.PATH + '/' + collection + parameters)
                .then((response: EdgesResponse) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }
    }

    export class QueryResponse extends ApiResponse {
        public bindVars: Array<any>;
        public collections: Array<string>;
    }

    export class Query {

        constructor(connection: Connection){
            this.connection = connection;
        }

        public static PATH: string = '_api/query';

        public connection: Connection;

        public execute(query: string): ng.IPromise<QueryResponse> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            this.connection.postRequest(Query.PATH, { query: query })
                .then((response: QueryResponse) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }
    }

    export class Simple {

        constructor(connection: Connection){
            this.connection = connection;
        }

        public static PATH: string = '_api/simple';

        public connection: Connection;

        public first(collection: string): ng.IPromise<CursorResponse> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            this.connection.putRequest(Simple.PATH + '/first', { collection: collection })
                .then((response: CursorResponse) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }

        public last(collection: string): ng.IPromise<CursorResponse> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            this.connection.putRequest(Simple.PATH + '/last', { collection: collection })
                .then((response: CursorResponse) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }

        public all(collection: string): ng.IPromise<CursorResponse> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            this.connection.putRequest(Simple.PATH + '/all', { collection: collection })
                .then((response: CursorResponse) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }

        public byExample(collection: string, example: any): ng.IPromise<CursorResponse> {
            var deferred: ng.IDeferred<any> = this.connection.$q.defer();

            this.connection.putRequest(Simple.PATH + '/by-example', { collection: collection, example: example })
                .then((response: CursorResponse) => {
                    deferred.resolve(response);
                })
                .catch((error: any) => {
                    deferred.reject(error ? error : { error: true });
                });

            return deferred.promise;
        }
    }
}

angular.module('application.component').provider('arango', ArangoDB.ArangoServiceProvider);