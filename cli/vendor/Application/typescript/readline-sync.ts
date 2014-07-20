interface IReadLineSyncStatic {
    question(message: string, options?: any): string;
    setEncoding(encoding: string);
    setPrompt(prompt: string);
}

declare var readLineSync: IReadLineSyncStatic;

declare module 'readline-sync' {
    export = readLineSync;
}