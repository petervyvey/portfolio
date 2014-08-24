/// <reference path='../reference.d.ts' />

import Q = require('q');
import readlineSync = require('readline-sync');
import PlugInModule = require('./ApplicationPlugIn');
import PlugInManagerModule = require('../plugin/PlugInManager');
import UtilsModule = require('../app/Utils');
import ArangoModule = require('../vendor/Application/arangodb/lib/arangodb');

export class Sync extends PlugInModule.ApplicationPlugIn {

    constructor() {
        super();
    }

    public static PLUGIN_NAME = 'sync';

    public static HELP_TEXT =
        '\t' + Sync.PLUGIN_NAME + '\r\n\t\t'
        + '--user={user}' + '\r\n\t\t'
        + '--password={password}' + '\r\n\t\t'
        + '--source={source folder}' + '\r\n\t\t'
        + '--destination={destination folder}';

    public run(options:any):Q.Promise<any> {
        var configuration: any = PlugInManagerModule.PlugInManager.RetrieveConfiguration(Sync.PLUGIN_NAME);

        if (!options.user) {
            options.user = readlineSync.question(PlugInManagerModule.PlugInManager.BuildPrompt('name', configuration.user));
        }
        options.user = options.user ? options.user : configuration.user;

        if (!options.password) {
            options.password = readlineSync.question(PlugInManagerModule.PlugInManager.BuildPrompt('password', configuration.password));
        }
        options.password = options.password ? options.password : configuration.password;

        if (!options.source) {
            options.source = readlineSync.question(PlugInManagerModule.PlugInManager.BuildPrompt('source', configuration.source));
        }
        options.source = options.source ? options.source : configuration.source;

        if (!options.destination) {
            options.destination = readlineSync.question(PlugInManagerModule.PlugInManager.BuildPrompt('destination', configuration.destination));
        }
        options.destination = options.destination ? options.destination : configuration.destination;

        PlugInManagerModule.PlugInManager.StoreConfiguration(Sync.PLUGIN_NAME, options);

        var deferred:Q.Deferred<any> = Q.defer();

        var database:ArangoModule.ArangoDB = ArangoModule.ArangoDB.CreateConnection({user: options.user, password: options.password, database: 'Portfolio'});

        var documentOptions:ArangoModule.DocumentOptions = new ArangoModule.DocumentOptions();
        documentOptions.createCollection = true;
        documentOptions.waitForSync = true;

        Q.all([
            database.document.create('Gallery', { id: UtilsModule.Guid.NewGuid(), name: 'People'}, documentOptions),
            database.document.create('Gallery', { id: UtilsModule.Guid.NewGuid(), name: 'Nature'}, documentOptions),
            database.document.create('Gallery', { id: UtilsModule.Guid.NewGuid(), name: 'Buildings'}, documentOptions)
        ])
            .then((response: Array<any>) => {
                deferred.resolve('galleries created');
            })
            .catch((error: any) => {
                deferred.reject(error);
            });

        return deferred.promise;
    }
}