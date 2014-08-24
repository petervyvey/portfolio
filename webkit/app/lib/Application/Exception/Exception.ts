
module Application.Exception {

    export class Exception {
        constructor(message: string){
            this.message = message;
        }

        public message: string;

        public toString(): string {
            return this.message;
        }
    }

    export class AbstractMethodException extends Exception {
        constructor(message: string) {
            super(message);
        }

        public static EXCEPTION_MESSAGE: string = 'ABSTRACT METHOD';
    }
}
