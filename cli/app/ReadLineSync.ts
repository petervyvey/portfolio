/// <reference path='../reference.d.ts' />

import stream = require('stream');
import fs = require('fs');


export class ReadlineSync {

    private static DEFAULT_PROMPT: string = '> ';

    private encoding: string = 'utf8';
    private BUF_SIZE: number = 256;
    private stdin: any = process.stdin;
    private stdout: any = process.stdout;
    private buffer: NodeBuffer = new Buffer(this.BUF_SIZE);

    private $readlineSync(display) {
        var input: string = '';
        var rsize;
        var err;

        if (display) {
            this.stdout.write(display, this.encoding);
        }

        this.stdin.resume();

        while (true) {
            rsize = 0;

            try {
                rsize = fs.readSync(<number>(this.stdin.fd), this.buffer, 0, this.BUF_SIZE, 0);
            }
            catch (e) {
                if (e.code === 'EOF') {
                    break;
                } // pipe
                if (e.code === 'EAGAIN') { // EAGAIN, resource temporarily unavailable
                    // util can't inherit Error.
                    err = new Error('The platform don\'t support interactively reading from stdin');
                    err.errno = e.errno;
                    err.code = e.code;
                }
                if (display) {
                    this.stdout.write('\n', this.encoding);
                } // Return from prompt line.
                throw err || e;
            }

            if (rsize === 0) {
                break;
            }

            input += this.buffer.toString(this.encoding, 0, rsize);
            if (/[\r\n]$/.test(input)) {
                break;
            }
        }

        this.stdin.pause();

        return input.trim();
    }

    public question(query) {
        return  this.$readlineSync(typeof query === 'string' ? query : ReadlineSync.DEFAULT_PROMPT);
    }
}
