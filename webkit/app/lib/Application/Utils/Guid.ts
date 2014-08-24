/// <reference path="../../../core/_reference.d.ts" />

module Application.Utils {
    export class Guid {
        public static NewGuid(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
                var r: number = Math.random()*16|0;
                var v: any = c == 'x' ? r : r&0x3|0x8;

                return v.toString(16);
            });
        }
    }
}
