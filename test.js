'use strict';

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ndjson = require('ndjson');
var fs = require('fs');
//var R = require("r-script");
//var shell = require('shelljs');
var cmd=require('node-cmd');
var events = require('events');
var Promise = require('promise');
var Intercom = require('intercom-client');

console.log("Computation is started!");
cmd.get(
    'Rscript cmdTest.R',
    function (err, data, stderr) {
        console.log('callback err:\n\n',err);
        console.log('callback stderr data:\n\n',stderr);
        console.log('callback data:\n\n',data);

        var emails = data.split("\"");
        emails.forEach(function(item, index, object) {
            if (item.indexOf("@") == -1) {
                object.splice(index, 1);
            }
        });
    }
);