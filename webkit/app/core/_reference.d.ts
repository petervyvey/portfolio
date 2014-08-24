/// <reference path='../typings/angularjs/angular.d.ts' />
/// <reference path='../typings/jquery/jquery.d.ts' />
/// <reference path='../typings/arangodb/arangodb.d.ts' />
/// <reference path='../typings/node-webkit/node-webkit.d.ts' />

/// <reference path='../lib/Application/Exception/Exception.ts' />
/// <reference path='../lib/Application/Utils/Guid.ts' />
/// <reference path='../vendor/application/lib/Arango.ts' />

declare module ng {

    interface IHttpService {
        /**
         * Shortcut method to perform PUT request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param data Request content
         * @param config Optional configuration object
         */
        patch<T>(url: string, data: any, config?: IRequestShortcutConfig): IHttpPromise<T>;
    }

}