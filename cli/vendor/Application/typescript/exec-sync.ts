declare var execSync: any;

declare module 'exec-sync' {
    export = execSync;
}