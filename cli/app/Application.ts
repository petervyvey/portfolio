/// <reference path='../reference.d.ts' />

import ExceptionModule = require('../app/Exception');
import ApplicationPlugInModule = require('../plugin/ApplicationPlugIn');
import PlugInManagerModule = require('../plugin/PlugInManager');

export class Application {
    
    constructor() { }

    private static DEFAULT_EXIT_CODE: number = 0;
    private static ERROR_EXIT_CODE: number = 1;

    public static Run(options: any): number {
        try {
            PlugInManagerModule.PlugInManager.RegisterPlugIns();

            var plugIn = PlugInManagerModule.PlugInManager.GetInstance(options._[0]);
            plugIn.run(options);

            return Application.DEFAULT_EXIT_CODE;
        }
        catch (error) {
            console.log('\r\n' + 'ERROR: ' + error.message + '\r\n');

            if (error.message == ExceptionModule.Exception.UNKNOWN_PLUG_IN || error.message == ExceptionModule.Exception.MISSING_PARAMETER_PLUG_IN_NAME) {
                console.log('USAGE: ' + '\r\n');
                console.log(PlugInManagerModule.PlugInManager.GetHelpText());
            }

            return Application.ERROR_EXIT_CODE;
        }
    }
}
