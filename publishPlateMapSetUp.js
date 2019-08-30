'use strict';
require('dotenv').config();
var AWS = require("aws-sdk");
var sns = new AWS.SNS();
var axios = require("axios");

const token = process.env.KAPTURE_JWT_TOKEN;
const url = process.env.KAPTURE_API + '/platemaps/atlas';

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));
        console.log('eventType', record.eventName);
        var image = record.dynamodb.NewImage ? record.dynamodb.NewImage : record.dynamodb.OldImage;

        var experiment = image.experiment && image.experiment.S ? image.experiment.S : null;
        var status = image.experiment && image.experiment.S ? image.status.S : null;
        var plateMaps = image.plateMaps && image.plateMaps.S ? JSON.parse(image.plateMaps.S) : null;
        if (status === 'COMPLETE') {
            saveToKapture(experiment, plateMaps, status, record.eventName);
        }
    });
    callback(null, `processed ${event.Records.length} records.`);
};


function saveToKapture(experiment, plateMaps, status, eventName) {
    var wellsToSave = formatWells(experiment, plateMaps);
    axios.post(url,
        {
            experimentName: experiment,
            wellWithComponents: wellsToSave
        }, {
            headers: {"Authorization": `Bearer ${token}`}
        }
    )
        .then(function (response) {
            console.log(response);
            sendSNS(experiment, status, plateMaps.length, "Shepherd SUCCEED in publishing to Kapture");
        })
        .catch(function (error) {
            console.log(error);
            sendSNS(experiment, status, plateMaps.length, "Shepherd FAILED to publish to Kapture");
        });
}

function formatWells(experiment, plateMaps) {
    var wellsToSave = [];
    plateMaps.forEach(function (plateMap) {
        var thePlateMap = {id: null, plateNumber: plateMap.id, platePurpose: null, plateType: null};
        plateMap.data.forEach(function (row) {
            var re0 = /[0-9]/g;
            var re1 = /[a-zA-Z]/g;
            row.forEach(function (cell) {
                var rowLabel = cell.id.replace(re0, '');
                var colLabel = cell.id.replace(re1, '');
                var theSample = {id: null, label: experiment + ".p" + plateMap.id + "." + cell.id};
                var theWell = {id: null, platemap: thePlateMap, sample: theSample, row: rowLabel, column: colLabel};
                var wellWithComponents = {well: theWell, wellComponents: cell.components};
                wellsToSave.push(wellWithComponents);
            });
        });
    });
    return wellsToSave;
}

function sendSNS(experiment, status, plateMapCount, message) {
    var params = {
        Subject: message + ":" + experiment,
        Message: '{ experiment: ' + experiment + ',\n   status: ' + status + ',\n   plateMaps: ' + plateMapCount + '}\n\n ',
        TopicArn: 'arn:aws:sns:us-east-1:001507046168:plateMapSetUpTopics'
    };

    sns.publish(params, function (err, data) {
        if (err) {
            console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Results from sending message: ", JSON.stringify(data, null, 2));
        }
    });
}
