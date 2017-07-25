var request = require("request");
var aws = require('aws-sdk');
var ses = new aws.SES();

exports.handler = function (event) {
    console.log(JSON.stringify(event, null, 2));
    var messageText = event.Records[0].Sns.Message;
    var message = JSON.parse(messageText);
    console.log(JSON.stringify(message, null, 2));
    var eParams = {
        Destination: {
            ToAddresses: [message.email]
        },
        Message: {
            Body: {
                Text: {
                    Data: "Awesome, a new submission has been created.\n\nYou can check it out at http://usi.skillsmapper.site/?submission=" + message.submissionUri.replace('http://submission-dev.ebi.ac.uk/api/submissions/', '')
                }
            },
            Subject: {
                Data: "USI Submission Created"
            }
        },
        Source: "noreply@skillsmapper.site"
    };
    var email = ses.sendEmail(eParams, function (err, data) {
        if (err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);
        }
    });
}