'use strict';

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ndjson = require('ndjson');
var fs = require('fs');
var events = require('events');

// db urls
var url_central = 'mongodb://localhost:27017/db_central';
var url_orange = 'mongodb://localhost:27017/db_orange';
var ajaxCallsRemaining = 2;
var data_path = "/usr/src/churnVolume";//__dirname;

//events
var eventEmitter = new events.EventEmitter();
eventEmitter.on("central_done", function(){
    console.log("central_done event has arrived!");
});
eventEmitter.on("orange_done", function(){
    console.log("orange_done event has arrived!");
});

var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('users');
    // Find some documents
    collection.find().toArray(function(err, docs) {
        assert.equal(err, null);
        // assert.equal(2, docs.length);
        console.log("Found the following records");
        callback(docs);
    });
};

// Use connect method to connect to the central db
MongoClient.connect(url_central, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server - db_central");
    findDocuments(db, function(docs) {
        console.log("central docs");
        var transformStream = ndjson.stringify();
        var outputStream = transformStream.pipe( fs.createWriteStream( data_path + "/users_central.json" ) );
        docs.forEach(
            function iterator( record ) {
                transformStream.write( record );
            }
        );
        transformStream.end();
        outputStream.on(
            "finish",
            function handleFinish() {
                console.log("users_central.json serialization complete!" );
                console.log( "- - - - - - - - - - - - - - - - - - - - - - -" );
                eventEmitter.emit("central_done");
                --ajaxCallsRemaining;
                if (ajaxCallsRemaining <= 0) {
                    console.log("files are prepared for processing!");
                }
            }
        );

        exports.getCentralUsers = function() {
            return docs;
        };
        db.close();
    });
});

// Use connect method to connect to the orange db
MongoClient.connect(url_orange, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server - db_orange");
    findDocuments(db, function(docs) {
        console.log("orange docs");
        var transformStream = ndjson.stringify();
        var outputStream = transformStream.pipe( fs.createWriteStream( data_path + "/users_orange.json" ) );
        docs.forEach(
            function iterator( record ) {
                transformStream.write( record );
            }
        );
        transformStream.end();
        outputStream.on(
            "finish",
            function handleFinish() {
                console.log( "users_orange.json serialization complete!");
                console.log( "- - - - - - - - - - - - - - - - - - - - - - -" );
                eventEmitter.emit("orange_done");
                --ajaxCallsRemaining;
                if (ajaxCallsRemaining <= 0) {
                    console.log("files are prepared for processing!");
                }
            }
        );

        exports.getOrangeUsers = function() {
            return docs;
        };
        db.close();
    });
});
