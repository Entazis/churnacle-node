'use strict';

var fs = require('fs');
var Promise = require('promise');
var Intercom = require('intercom-client');
var csv = require("fast-csv");

var data_path = __dirname;//"/usr/src/churnVolume";

var intercom = new Intercom.Client({
    appId: '',
    appApiKey:  ''
});

/**
 * This function checks if the user exists in intercom. If not, returns false
 * @param {string} userEmail The user email
 * @returns {intercom.user | {status: boolean, msg: string}}
 *      - user the Intercom user object if found
 *      - the status indicator if an error occurs
 */
function getUser(userEmail) {
    return new Promise(function(resolve, reject) {
        var logMessage = '';
        /* Try to get user */
        intercom.users.find({"email": userEmail }).then(function(response) {
            var user = response.body;
            resolve(user);
        }, function(err) {
            logMessage = 'INTERCOM | getUser | error';
            console.log("user: " + userEmail + " detailedMessage: " + err.message.statusCode);
            reject({status:false, msg: logMessage});
        });
    });
}

/**
 * @param {string} data The user email, endDate, test group
 * @param {string} subject The email subject
 * @param {string} body The email body
 * @return {{status: boolean, msg: string}} status The status indicator
 */
var sendEmailToUser = function(data, subject, body) {

    return new Promise(function(resolve, reject) {
        var logMessage = '';

        if(data.test == "A"){
            /* Get user */
            getUser(data.email).then(function (user) {
                if(user.location_data.country_code == "HUN"){
                    var subject = "[CodeBerry] Egy gyors kérdés";
                    var body = "Kedves "+user.name.split(' ')[0]+"!\n" +
                        "\n" +
                        "Egy gyors kérdés: minden oké?\n" +
                        "\n" +
                        "Elég, ha egy betűt válaszolsz:\n" +
                        "\n" +
                        "a) igen, köszi, minden oké\n" +
                        "b) nem, valahol elakadtam\n" +
                        "c) egyéb:\n" +
                        "\n" +
                        "\n" +
                        "Ha pedig szeretnél beugrani most\n" +
                        "csak 5 percet programozni tanulni, \n" +
                        "kattints:\n" +
                        "http://orange.codeberryschool.com \n";

                    /* Create Admin initiated message */
                    var intercomMessage = {
                        message_type: "email",
                        subject: subject,
                        body: body,
                        template: "personal",
                        from: {
                            type: "admin",
                            id: "929223"
                        },
                        to: {
                            type: "user",
                            email: user.email
                        }
                    };

                    /* Send email through intercom */
                    intercom.messages.create(intercomMessage).then(function() {
                        logMessage = 'INTERCOM | sendEmailToUser | email sent';
                        console.log("user: " + user.email);
                        resolve({status:true, msg: logMessage});
                    }, function(err){
                        logMessage = 'INTERCOM | sendEmailToUser | failed to send email';
                        console.log("user: " + data.email + " detailedMessage: " + err);
                        reject({status:false, msg: logMessage});
                    });
                }
            }, function (reason) {
                reject(reason);
            });
        }

    });
};

/*
var sendEmails = function (emails, callback) {
    emails.forEach(function(email) {
        console.log("sending: " + email);
        sendEmailToUser(email, 0, 0);
    });
    callback(0);
};
*/
/*
csv.fromPath(data_path+"/emailstest.csv")
    .on("data", function(data){
        console.log("churning emails: " + data);
        sendEmails(data,function (err) {
            if(err) console.log("Something went wrong!");
            else console.log("All emails were sent successfully");
        });
    });
*/
var stream = fs.createReadStream(data_path+"/emailstest_test.csv");
csv
    .fromStream(stream, {headers: true})
    .on("data", function(data){
        console.log("churning email: " + data.email + " testing: " + data.test);
        sendEmailToUser(data, 0, 0);
    })
    .on("end", function(){
        console.log("done");
    });