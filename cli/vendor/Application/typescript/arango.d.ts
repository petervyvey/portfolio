interface IArangoStatic {
        Connection(parameters: any): any;
}

declare var arango: IArangoStatic;

declare module 'arango' {
    export = arango;
}