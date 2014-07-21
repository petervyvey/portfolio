/// <reference path='../reference.d.ts' />

import stream = require('stream');
import readline = require('readline');
import underscore = require('underscore');
import readlineSync = require('readline-sync');
import minimist = require('minimist');
import PlugInModule = require('./ApplicationPlugIn');

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
        if (!options.user) {
            options.user = readlineSync.question('name: ');
        }

        if (!options.password) {
            options.password = readlineSync.question('password: ');
        }

        if (!options.source) {
            options.source = readlineSync.question('source: ');
        }

        if (!options.destination) {
            options.destination = readlineSync.question('destination: ');
        }

        console.log('welcome ' + options.user + '/' + options.password);
    }
}