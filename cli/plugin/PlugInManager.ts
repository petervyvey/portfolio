/// <reference path='../reference.d.ts' />

import path = require('path');
import fs = require('fs');
import _ = require('underscore');

import ExceptionModule = require('../app/Exception');
import ApplicationPlugInModule = require('plugin/ApplicationPlugIn');

export class ApplicationPlugInInfo {

    constructor(plugIn: string, name: string) {
        this.plugIn = plugIn;
        this.name = name;
    }


    public plugIn: string;
    public name: string;

}

export class Dictionary<TValue> {
    public items: Array<TValue> = [];

    add(key: string, value: TValue) {
        this.items.push(value);
        this.items[key] = value;
    }

    get(key: string) {
        return this.items[key];
    }

    getByIndex(index: number) {
        return this.items[index];
    }
}

export class PlugInManager {

    public static APPLICATION_PLUG_IN_REGISTRY: Dictionary<ApplicationPlugInInfo> = new Dictionary<ApplicationPlugInInfo>();

    public static RegisterPlugIns(): void {
        if (PlugInManager.APPLICATION_PLUG_IN_REGISTRY.items.length == 0) {
            var cache: Dictionary<ApplicationPlugInInfo> = new Dictionary<ApplicationPlugInInfo>();

            var folderName: string = path.join(__dirname,'..', 'plugin');
            var files = fs.readdirSync(folderName);

            files.forEach((file) => {
                var isJavaScriptFile = file.match(/\.js$/);

                if (isJavaScriptFile) {
                    var moduleName:string = file.replace(/\.js$/, '');

                    if (moduleName !== 'ApplicationPlugIn' && moduleName !== 'PlugInManager' ) {
                        var plugInModule = require(path.join(folderName, moduleName));

                        var plugInPrototype = Object.create(plugInModule[moduleName].prototype);
                        cache.add(moduleName.toLocaleLowerCase(), plugInPrototype);
                    }
                }
            });

            PlugInManager.APPLICATION_PLUG_IN_REGISTRY = cache;
        }
    }

    public static GetInstance(plugInName: string): ApplicationPlugInModule.ApplicationPlugIn {
        if (!plugInName) throw new Error(ExceptionModule.Exception.MISSING_PARAMETER_PLUG_IN_NAME);

        var instance:any = PlugInManager.APPLICATION_PLUG_IN_REGISTRY.get(plugInName.toLowerCase());

        if (!instance) throw new Error(ExceptionModule.Exception.UNKNOWN_PLUG_IN);

        instance.constructor();

        return instance;
    }

    public static GetHelpText(): string {
        var helpText: string = '';

        PlugInManager.APPLICATION_PLUG_IN_REGISTRY.items.forEach((plugIn: any) => {
            helpText = helpText + plugIn.constructor.HELP_TEXT + '\r\n';
        });

        return helpText;
    }

}
