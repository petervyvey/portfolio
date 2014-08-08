/// <reference path='../reference.d.ts' />

import stream = require('stream');
import readline = require('readline');
import underscore = require('underscore');
import readlineSync = require('readline-sync');
import minimist = require('minimist');
import PlugInModule = require('./ApplicationPlugIn');
import PlugInManagerModule = require('../plugin/PlugInManager');
import execSync = require('exec-sync');
//import Arango = require('arangojs');
import restler = require('restler');
import ArangoModule = require('../vendor/Application/arangodb/lib/arangodb');


export class Sync extends PlugInModule.ApplicationPlugIn {

    constructor(){
        super();
    }

    public static PLUGIN_NAME = 'sync';

    public static HELP_TEXT =
        '\t' + Sync.PLUGIN_NAME + '\r\n\t\t'
            + '--user={user}' + '\r\n\t\t'
            + '--password={password}' + '\r\n\t\t'
            + '--source={source folder}' + '\r\n\t\t'
            + '--destination={destination folder}';

    public run(options: any): void {
        var request = require('request');


//        restler.get('http://google.com').on('complete', function(result) {
//            if (result instanceof Error) {
//                console.log('Error:', result.message);
//                this.retry(5000); // try again after 5 sec
//            } else {
//                console.log(result);
//            }
//        });

        var database: ArangoModule.ArangoDB = ArangoModule.ArangoDB.CreateConnection({user:'web', password:'linux', database:'Portfolio'});

        var documentOptions: ArangoModule.DocumentOptions = new ArangoModule.DocumentOptions();
        documentOptions.createCollection = true;
        documentOptions.waitForSync = true;

        database.document.create('Gallery', { id: 2, name: 'People'}, documentOptions, (response: any) => {
            console.log(response);
        });
//
//        var configuration:any = PlugInManagerModule.PlugInManager.RetrieveConfiguration(Sync.PLUGIN_NAME);
//
//        if (!options.user) {
//            options.user = readlineSync.question(PlugInManagerModule.PlugInManager.BuildPrompt('name', configuration.user));
//        }
//        options.user = options.user ? options.user : configuration.user;
//
//        if (!options.password) {
//            options.password = readlineSync.question(PlugInManagerModule.PlugInManager.BuildPrompt('password', configuration.password));
//        }
//        options.password = options.password ? options.password : configuration.password;
//
//        if (!options.source) {
//            options.source = readlineSync.question(PlugInManagerModule.PlugInManager.BuildPrompt('source', configuration.source));
//        }
//        options.source = options.source ? options.source : configuration.source;
//
//        if (!options.destination) {
//            options.destination = readlineSync.question(PlugInManagerModule.PlugInManager.BuildPrompt('destination', configuration.destination));
//        }
//        options.destination = options.destination ? options.destination : configuration.destination;
//
//        PlugInManagerModule.PlugInManager.StoreConfiguration(Sync.PLUGIN_NAME, options);
    }
}