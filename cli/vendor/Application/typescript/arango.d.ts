interface IArangoStatic {
        Connection(parameters: any): any;
}

declare var arango: IArangoStatic;

declare module 'arangojs' {
    export = arango;
}