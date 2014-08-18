#!/usr/bin/env node

var Q = require('q');
var minimist = require('minimist')
var ApplicationModule = require('./app/Application');

//  Parse the runtime arguments.
var options = minimist(process.argv.slice(2), opts={});

// Run the application.
var promise = ApplicationModule.Application.Run(options);
promise
    .then(function(message) {
        console.log(message);
        process.exit(ApplicationModule.Application.DEFAULT_EXIT_CODE);
    })
    .catch(function(error){
        if (error) console.log(error);
        process.exit(ApplicationModule.Application.ERROR_EXIT_CODE);
    });
