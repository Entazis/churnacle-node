var sendEmailToUser = function(email, subject, body) {
    return new Promise(function(resolve, reject) {
        var logMessage = '';
        //intercom.users.find({ email: email }, callback);

        var intercomMessage = {
            message_type: "email",
            subject: subject,
            body: body,
            template: "personal",
            from: {
                type: "admin",
                id: "34850"
            },
            to: {
                type: "user",
                email: email
            }
        };

        intercom.messages.create(intercomMessage).then(function() {
            logMessage = 'INTERCOM | sendEmailToUser | email sent';
            console.log(logMessage+"user: "+email);
            resolve({status:true, msg: logMessage});
        }, function(err){
            logMessage = 'INTERCOM | sendEmailToUser | failed to send email';
            console.log(logMessage+"user: "+email+" err: "+err);
            reject({status:false, msg: logMessage});
        });
    });
};
sendEmailToUser("szabo.bence.tat@gmail.com", "testSubject2", "testBody2").then(console.log);
/*
const fs = require('fs');
const unzipper = require('unzip2');
const decompress = require('decompress');
const decompressTarbz2 = require('decompress-tarbz2');
const BsonJsonTransform = require('bson-json-transform');
const eventEmitter = require('events').EventEmitter;
const path = require('path');
const BSON = require('bson');
const cmd=require('node-cmd');

function extract(){
    console.log("Extracting codeberry-orange-production..");
    decompress(path.join(__dirname, 'data\\backblaze\\codeberry-orange\\production\\codeberry-orange-production-20171030-1052.tar.bz2'),
        path.join(__dirname, 'data\\backblaze'), {
            plugins: [
                decompressTarbz2()
            ]
        }).then(function() {
        console.log('Orange files decompressed');
        ee.emit("parse_orange");
    });

        console.log("Extracting codeberry-central-production..");
        decompress(path.join(__dirname, 'data\\backblaze\\codeberry-central\\production\\codeberry-central-production-20171030-1050.tar.bz2'),
            path.join(__dirname, 'data\\backblaze'), {
                plugins: [
                    decompressTarbz2()
                ]
            }).then(function() {
            console.log('Central files decompressed');
            ee.emit("parse_central");
        });

}
function parse_central() {
    console.log("Transforming users.bson to users_central.json..");
    cmd.get(
        'D:\\Programs\\MongoDB\\Server\\3.4\\bin\\bsondump D:\\Projects\\Codeberry\\codeberry-machine-learning-node\\data\\backblaze\\codeberry-central-production-20171030-1050\\codeberry-central-production\\users.bson > D:\\Projects\\Codeberry\\codeberry-machine-learning-node\\data\\users_central.json',
        function(err, data, stderr){
            console.log("central has been parsed!");
            //ee.emit("parse_finished");
        }
    );

        var stream = fs.createReadStream('data\\backblaze\\codeberry-central-production-20171030-1050\\codeberry-central-production\\users.bson')
            .pipe(BsonJsonTransform({ preserveInt64: 'string', arrayOfBsons: true}))
            .pipe(fs.createWriteStream('data\\users_central.json'));
        stream.on('finish', function () {
            console.log("central has been parsed!");
            //ee.emit("parse_finished");
        });

}
function parse_orange() {
    console.log("Transforming users.bson to users_orange.json..");

    //FIXME
    /*
    cmd.get(
        'D:\\Programs\\MongoDB\\Server\\3.4\\bin\\bsondump D:\\Projects\\Codeberry\\codeberry-machine-learning-node\\data\\backblaze\\codeberry-central-production-20171030-1050\\codeberry-central-production\users.bson > D:\\Projects\\Codeberry\\codeberry-machine-learning-node\\data\users_central.json',
        function(err, data, stderr){
            console.log("central has been parsed!");
            //ee.emit("parse_finished");
        }
    );

    var stream = fs.createReadStream('data/backblaze/codeberry-orange-production-20171030-1052/codeberry-orange-production/users.bson')
        .pipe(BsonJsonTransform({ preserveInt64: 'string', arrayOfBsons: true}))
        .pipe(fs.createWriteStream('data/users_orange.json'));
    stream.on('finish', function () {
        console.log("orange has been parsed!");
        //ee.emit("parse_finished");
    });

}
function parse_finished() {
    console.log("File extractions and conversions are finished!");
}

var ee = new eventEmitter;
ee.on('extract', extract);
ee.on('parse_central', parse_central);
ee.on('parse_orange', parse_orange);
ee.on('parse_finished', parse_finished);

console.log("Extracting backblaze_download..");
var stream = fs.createReadStream('data/backblaze/backblaze_download_20171030_113425.zip')
    .pipe(unzipper.Extract({path:'data/backblaze'}));
stream.on('finish', function () {
    console.log("backblaze has been unzipped!");
    ee.emit("extract");
});

cmd.get(
    'dir',
    function(err, data, stderr){
        console.log('the current working dir is : ',data)
    }
);
*/