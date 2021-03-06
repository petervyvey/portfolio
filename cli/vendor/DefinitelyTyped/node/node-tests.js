/// <reference path="node.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var assert = require("assert");
var fs = require("fs");
var events = require("events");
var zlib = require("zlib");
var url = require('url');
var util = require("util");

assert(1 + 1 - 2 === 0, "The universe isn't how it should.");

assert.deepEqual({ x: { y: 3 } }, { x: { y: 3 } }, "DEEP WENT DERP");

assert.equal(3, "3", "uses == comparator");

assert.notStrictEqual(2, "2", "uses === comparator");

assert.throws(function () {
    throw "a hammer at your face";
}, undefined, "DODGED IT");

assert.doesNotThrow(function () {
    if (false) {
        throw "a hammer at your face";
    }
}, undefined, "What the...*crunch*");

fs.writeFile("thebible.txt", "Do unto others as you would have them do unto you.", assert.ifError);

fs.writeFile("Harry Potter", "\"You be wizzing, Harry,\" jived Dumbledore.", {
    encoding: "ascii"
}, assert.ifError);

var Networker = (function (_super) {
    __extends(Networker, _super);
    function Networker() {
        _super.call(this);

        this.emit("mingling");
    }
    return Networker;
})(events.EventEmitter);

url.format(url.parse('http://www.example.com/xyz'));

// https://google.com/search?q=you're%20a%20lizard%2C%20gary
url.format({
    protocol: 'https',
    host: "google.com",
    pathname: 'search',
    query: { q: "you're a lizard, gary" }
});

// Old and new util.inspect APIs
util.inspect(["This is nice"], false, 5);
util.inspect(["This is nice"], { colors: true, depth: 5, customInspect: false });

////////////////////////////////////////////////////
/// Stream tests : http://nodejs.org/api/stream.html
////////////////////////////////////////////////////
// http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
function stream_readable_pipe_test() {
    var r = fs.createReadStream('file.txt');
    var z = zlib.createGzip();
    var w = fs.createWriteStream('file.txt.gz');
    r.pipe(z).pipe(w);
}
//# sourceMappingURL=node-tests.js.map
