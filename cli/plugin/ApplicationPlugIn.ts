/// <reference path='../reference.d.ts' />

import Q = require('q');
import ExceptionModule = require('../app/Exception');

export enum ApplicationPlugInState {
    CREATED = <any>'CREATED',
    STARTING = <any>'STARTING',
    RUNNING = <any>'RUNNING',
    FINISHED = <any>'FINISHED'
}

export interface IApplicationPlugIn {
    name: string;
    run(options: any): Q.Promise<any>;
}

export class ApplicationPlugIn implements IApplicationPlugIn {

    public name: string;
    public state: ApplicationPlugInState = ApplicationPlugInState.CREATED;

    public $getClassName() {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((<any> this).constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }

    public run(options: any): Q.Promise<any> {
        throw new Error(ExceptionModule.Exception.ABSTRACT_METHOD);
    }
}
