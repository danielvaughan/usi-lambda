
var aws = require('aws-sdk');

exports.handler = function (event) {
    console.log(JSON.stringify(event, null, 2));
    var messageText = event.Records[0].Sns.Message;
    var message = JSON.parse(messageText);
    var type = message.type;
    type = type.toUpperCase();
    console.log('type:' + type);
    switch (type) {
        case "USI-NEW-SUBMISSION":
            var sns = new aws.SNS();
            var payload = {
                "email" : message.source,
                "team" : message.subject
            }
            var payloadStr = JSON.stringify(payload);
            sns.publish({
                            Message: payloadStr,
                            TargetArn: 'arn:aws:sns:eu-west-1:226475284860:usi-submission-requested'
                        }, function (err) {
                if (err) {
                    console.error('Error publishing to SNS usi-submission-requested');
                } else {
                    console.info('Message published to SNS usi-submission-requested');
                }
            });
    }
}