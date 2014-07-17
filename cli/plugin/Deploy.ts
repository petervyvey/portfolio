/// <reference path='../reference.d.ts' />

import stream = require('stream');
import ReadLineSyncModule = require('../app/ReadLineSync');
import PlugInModule = require('./ApplicationPlugIn');

export class Deploy extends PlugInModule.ApplicationPlugIn {

    constructor(){
        super();
    }

    public static PLUGIN_NAME = 'deploy';

    public static HELP_TEXT = '\t' + Deploy.PLUGIN_NAME + PlugInModule.ApplicationPlugIn.HELP_LINE.slice(Deploy.PLUGIN_NAME.length) + '--user=user --password=password';

    private readline: ReadLineSyncModule.ReadlineSync = new ReadLineSyncModule.ReadlineSync();

    public run(options: any): void {
        if (!options.user) {
            var name: string = this.readline.question('name: ');
        }

        if (!options.password) {
            var password: string = this.readline.question('password: ');
        }

        console.log('welcome ' + options.user);
    }
}