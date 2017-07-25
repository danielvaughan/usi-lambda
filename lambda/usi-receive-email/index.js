var request = require("request");
var aws = require('aws-sdk');

exports.handler = function (event) {
    console.log(JSON.stringify(event, null, 2));
    var sesNotification = event.Records[0].ses;
    var destination = sesNotification.mail.destination;
    var messageId = sesNotification.mail.messageId;
    var source = sesNotification.mail.source;
    var type = extractType(destination);
    var subject = extractSubject(sesNotification);
    var people = extractPeople(destination);

    var payload = {
        id: messageId,
        source: source,
        type: type,
        subject: subject,
        people: people
    };

    sendSns(payload);
};

function extractSubject(sesNotification) {
    var subject = '';
    var headers = sesNotification.mail.headers;
    for (var i = 0; i < headers.length; i++) {
        if (headers[i].name === 'Subject') {
            subject = headers[i].value;
        }
    }
    return subject;
}

function extractType(destination) {
    var type = destination[0].replace('@skillsmapper.site', '');
    return type.toLowerCase();
}

function extractPeople(destination) {
    var people = [];
    for (var i = 1; i < destination.length; i++) {
        people.push(destination[i]);
    }
    return people;
}

function sendSns(payload) {
    var sns = new aws.SNS();
    var payloadStr = JSON.stringify(payload);
    console.log('Sending new message to SNS with payload: ' + payloadStr);
    sns.publish({
                    Message: payloadStr,
                    TargetArn: 'arn:aws:sns:eu-west-1:226475284860:usi-email-received'
                }, function (err) {
        if (err) {
            console.error('Error publishing to SNS');
        } else {
            console.info('Message published to SNS');
        }
    });
}
