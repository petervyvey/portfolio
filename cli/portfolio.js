#!/usr/bin/env node

console.log('portfolio');

var minimist = require('minimist')
var ApplicationModule = require('./app/Application');

//  Parse the runtime arguments.
var options = minimist(process.argv.slice(2), opts={});

// Run the application.
var exitCode = ApplicationModule.Application.Run(options);

// Use run return value as exit code.
process.exit(exitCode);
