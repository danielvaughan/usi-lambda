var request = require("request");
var aws = require('aws-sdk');

exports.handler = function (event) {
    console.log(JSON.stringify(event, null, 2));
    var messageText = event.Records[0].Sns.Message;
    var message = JSON.parse(messageText);
    var submissionsUrl = 'http://submission-dev.ebi.ac.uk/api/submissions';
    var submissionObject = {
        "submitter" : {
            "email" : message.email
        },
        "team" : {
            "name" : message.team
        }
    };
    request.post({
             uri: submissionsUrl,
             json: submissionObject
         },
         function (err, resp) {
             if (err) {
                 console.log(JSON.stringify(err));
             } else {
                 if (resp.statusCode==201)
                 {
                     console.log("Created successfully");
                     var submissionUri = resp.body._links.self.href;
                     var sns = new aws.SNS();
                     var payload = {
                         "email" : message.email,
                         "submissionUri" : submissionUri
                     }
                     var payloadStr = JSON.stringify(payload);
                     sns.publish({
                             Message: payloadStr,
                             TargetArn: 'arn:aws:sns:eu-west-1:226475284860:usi-submission-created'
                         }, function (err) {
                         if (err) {
                             console.error('Error publishing to SNS usi-submission-created');
                         } else {
                             console.info('Message published to SNS usi-submission-created');
                         }
                     });
                 }
             }
         }
    );
}