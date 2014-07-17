/// <reference path='../reference.d.ts' />

import ExceptionModule = require('../app/Exception');

export interface IApplicationPlugIn {

    name: string;
    run(options: any);
}

export class ApplicationPlugIn implements IApplicationPlugIn {

    public static HELP_LINE: string = new Array(41).join(' ');

    public name: string;

    public $getClassName() {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((<any> this).constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }

    public run(options: any): void {
        throw new Error(ExceptionModule.Exception.ABSTRACT_METHOD);
    }
}
