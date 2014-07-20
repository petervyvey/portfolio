/// <reference path='../reference.d.ts' />

import stream = require('stream');
import readline = require('readline');
import underscore = require('underscore');
import readlineSync = require('readline-sync');
import minimist = require('minimist');
import PlugInModule = require('./ApplicationPlugIn');

export class Deploy extends PlugInModule.ApplicationPlugIn {

    constructor(){
        super();
    }

    public static PLUGIN_NAME = 'deploy';

    public static HELP_TEXT = '\t' + Deploy.PLUGIN_NAME + '\r\n\t\t' + '--user={user}' + '\r\n\t\t' + '--password={password}';

    public run(options: any): void {
        if (!options.user) {
            options.user = readlineSync.question('name: ');
        }

        if (!options.password) {
            options.password = readlineSync.question('password: ');
        }

        console.log('welcome ' + options.user + '/' + options.password);
    }
}