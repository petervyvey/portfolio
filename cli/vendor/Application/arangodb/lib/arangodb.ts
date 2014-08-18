/// <reference path="../../../../reference.d.ts" />

import restler = require('restler');
import Q = require('q');

export class ArangoDB {

    constructor(connection: Connection){
        this.connection = connection;

        this.document = new Document(this.connection);
    }

    public static CreateConnection(options: IConnectionOptions): ArangoDB {
        var connection: Connection = Connection.Create(ConnectionOptions.CreateConnection(options));
        var instance: ArangoDB = new ArangoDB(connection);

        return instance;
    }

    public connection: Connection;
    public document: Document;
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

    public static CreateConnection(options: IConnectionOptions): ConnectionOptions {
        var instance: ConnectionOptions = new ConnectionOptions(options.protocol, options.address, options.port, options.user, options.password, options.database);

        return instance;
    }

    public getServerUrl(): string {
        return this.protocol + '://' + this.user + ':' + this.password + '@' + this.address + ':' + this.port + '/_db/' + this.database + '/';
    }
}

export class Connection {

    constructor(serverUrl?: string) {
        this.serverUrl = serverUrl;
    }

    public static Create(options: ConnectionOptions): Connection {
        var instance: Connection = new Connection();
        instance.serverUrl = options.getServerUrl();

        return instance;
    }

    public serverUrl: string;

    public post(path: string, data: any): Q.Promise<any> {
        var url:string = this.serverUrl + path;

        var deferred: Q.Deferred<any> = Q.defer();
        restler.postJson(url, data)
            .on('complete', (result: any) => {
                if (!(result instanceof Error || result === '' || (result && result.error))) {
                    deferred.resolve(result);
                } else {
                    deferred.reject(result);
                }
            });

        return deferred.promise;
    }
}

export class OptionsBase {

    public toParameters(): string {
        return Object.keys(this).reduce((previous: string, current: string, c: number) => {
            var parameter: string = current + '=' + this[current];
            return !previous ? '?' + parameter : previous + '&' + parameter;
        }, '');
    }
}

export class DocumentOptions extends OptionsBase {
    public collection: string = '';
    public createCollection: boolean = false;
    public waitForSync: boolean = false;
}

export class Document {

    constructor(connection: Connection){
        this.connection = connection;
    }

    public static PATH: string = '_api/document';

    public connection: Connection;

    public create(collection: string, data: any, options?: DocumentOptions): Q.Promise<any> {
        var deferred: Q.Deferred<any> = Q.defer();

        var parameters: string = '';
        if (!options){
            options = new DocumentOptions();
        }

        options.collection = collection;
        parameters = options.toParameters();

        this.connection.post(Document.PATH + parameters, data)
            .then((response: any) => {
                deferred.resolve(response);
            })
            .catch((error: any) => {
                deferred.reject(error ? error : { error: true });
            });

        return deferred.promise;
    }
}


