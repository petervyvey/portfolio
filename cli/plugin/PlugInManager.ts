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
        if (!plugInName) throw new Error(ExceptionModule.Exception.MISSING_PARAMETER_COMMAND_NAME);

        var instance:any = PlugInManager.APPLICATION_PLUG_IN_REGISTRY.get(plugInName.toLowerCase());

        //if (!instance) throw new Error(ExceptionModule.Exception.UNKNOWN_COMMAND + ' \'' + plugInName + '\'');
        if (!instance) throw new Error(ExceptionModule.Exception.UNKNOWN_COMMAND);

        instance.constructor();

        return instance;
    }

    public static RetrieveConfiguration(plugInName: string): any {
        var configurationValue: string = (fs.readFileSync('portfolio.config.json', { encoding: 'utf-8' })).toString();
        var _configuration = JSON.parse(configurationValue);

        return _configuration[plugInName];
    }

    public static StoreConfiguration(plugInName: string, configuration: any): any {
        var configurationValue:string = (fs.readFileSync('portfolio.config.json', { encoding: 'utf-8' })).toString();
        var _configuration = JSON.parse(configurationValue);
        _configuration[plugInName] = configuration;

        fs.writeFileSync('portfolio.config.json', JSON.stringify(_configuration), { encoding: 'utf-8' })

        return _configuration[plugInName];
    }

    public static BuildPrompt(prompt: string, defaultAnswer?: string): string {
        var defaultAnswer: string = defaultAnswer ? ' [' + defaultAnswer + ']' : '';
        prompt = prompt + defaultAnswer + ': ';

        return prompt;
    }

    public static GetHelpText(): string {
        var helpText: string = '';

        PlugInManager.APPLICATION_PLUG_IN_REGISTRY.items.forEach((plugIn: any) => {
            helpText = helpText + plugIn.constructor.HELP_TEXT + '\r\n\r\n';
        });

        return helpText;
    }
}
