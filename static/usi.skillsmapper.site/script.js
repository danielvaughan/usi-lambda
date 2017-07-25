$(document).ready(function () {
    var submissionId = GetURLParameter('submission');
    var submissionUrl = 'https://3ei9b35nb2.execute-api.eu-west-1.amazonaws.com/test/usi/submission/'
                        + submissionId;
    console.log(submissionUrl);
    $.ajax({url: submissionUrl}).then(function (submissionData) {
        console.log(submissionData)
        $("#id").append(submissionId)
        if (submissionData.submitter) {
            $("#submitter").append(submissionData.submitter.email)
        }
        if (submissionData.createdDate) {
            $("#createdDate").append(formatDate(new Date(submissionData.createdDate)))
        }
        $("#sSubmissionId").val(submissionId);
    });
    refreshSamples(submissionId);
});

$("#sample-submit-button").submit(function (e) {
    e.preventDefault();
    var sampleSubmissionData = {
        "alias" : $('#sAlias').val(),
        "archive" : $('#sArchive').val(),
        "title" : $('#sTitle').val(),
        "description" : $('sDescription').val(),
        "attributes" : [ {
            "name" : "Cell line type",
            "value" : "EBV-LCL cell line",
            "terms" : [ {
                "url" : "http://purl.obolibrary.org/obo/BTO_0003335"
            } ]
        } ],
        "sampleRelationships" : [ {
            "accession" : "SAME123392",
            "relationshipNature" : "Derived from"
        } ],
        "taxonId" : 9606,
        "taxon" : "Homo sapiens",
        "submission" : "http://submission-dev.ebi.ac.uk/api/submissions/" + $('#sSubmissionId').val()
    }
    console.log(sampleSubmissionData);
    $.ajax({
               type: "POST",
               url: "https://3ei9b35nb2.execute-api.eu-west-1.amazonaws.com/test/usi/samples",
               data: sampleSubmissionData
           });
});

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function refreshSamples(submissionId) {
    var samplesUrl = 'https://3ei9b35nb2.execute-api.eu-west-1.amazonaws.com/test/usi/submission/'
                     + submissionId + '/samples';
    $.ajax({url: samplesUrl}).then(function (sampleData) {
        console.log(sampleData);
        var tableHtml = "";
        tableHtml = tableHtml +
                    "<table class='table'>" +
                    "<thead>"
                    + "<tr><th>Alias</th><th>Archive</th><th>Title</th><th>Last Modified</th><th>Processing Status</th></tr>"
                    + "</thead><tbody>";
        if (sampleData._embedded.samples.length > 0) {
            for (var l = 0; l < sampleData._embedded.samples.length; l++) {
                var sample = sampleData._embedded.samples[l];
                tableHtml = tableHtml + ("<tr>"
                            + "<td>" + sample.alias + "</td>"
                            + "<td>" + sample.archive + "</td>"
                            + "</td><td>" + sample.title + "</td>"
                            + "<td>" + formatDate(new Date(sample.lastModifiedDate))
                            + "<td><span class='badge'>" + sample.processingStatus + "</span></td>"
                            + "</tr>");
            }
        }
        else {
            tableHtml = tableHtml + "<tr><td span='5'>No samples submitted yet</td></tr>"
        }
        tableHtml = tableHtml + "</tbody></table>";
        $("#samples").append(tableHtml);
    });
}

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}