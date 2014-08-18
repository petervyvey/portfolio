/// <reference path='../reference.d.ts' />

import Q = require('q');
import ExceptionModule = require('../app/Exception');
import ApplicationPlugInModule = require('../plugin/ApplicationPlugIn');
import PlugInManagerModule = require('../plugin/PlugInManager');

export class Application {
    
    constructor() { }

    private static DEFAULT_EXIT_CODE: number = 0;
    private static ERROR_EXIT_CODE: number = 1;

    public static Run(options: any): Q.Promise<any> {
        try {
            PlugInManagerModule.PlugInManager.RegisterPlugIns();

            var plugIn: ApplicationPlugInModule.IApplicationPlugIn = PlugInManagerModule.PlugInManager.GetInstance(options._[0]);
            var promise: Q.Promise<any> = plugIn.run(options);

            return promise;
        }
        catch (error) {
            console.log('\r\n' + 'ERROR: ' + error.message + '\r\n');

            if (error.message == ExceptionModule.Exception.UNKNOWN_COMMAND || error.message == ExceptionModule.Exception.MISSING_PARAMETER_COMMAND_NAME) {
                console.log('USAGE: ' + '\r\n');
                console.log(PlugInManagerModule.PlugInManager.GetHelpText());
            }

            var deferred:Q.Deferred<any> = Q.defer();
            setInterval(() => {
                deferred.reject(null);
            }, 500);

            return deferred.promise;
        }
    }
}
