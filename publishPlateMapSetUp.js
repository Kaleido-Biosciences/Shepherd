'use strict';
require('dotenv').config();
var AWS = require("aws-sdk");
var sns = new AWS.SNS();
var axios = require("axios");
// var url = 'https://kapture-staging.apps.kaleidobio.com/api/platemaps/atlas';
var url = 'http://localhost:8080/api/platemaps/atlas';

const token = process.env.KAPTURE_JWT_TOKEN;

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));
        console.log('eventType', record.eventName);
        var image = record.dynamodb.NewImage?record.dynamodb.NewImage:record.dynamodb.OldImage;

        var experiment = image.experiment && image.experiment.S?image.experiment.S:null;
        var status = image.experiment && image.experiment.S?image.status.S:null;
        var plateMaps = image.plateMaps && image.plateMaps.S?JSON.parse(image.plateMaps.S):null;
        if (status === 'COMPLETE') {
            saveToKapture(experiment, plateMaps);

            var params = {
                Subject: record.eventName + ":" + experiment,
                Message: '{ experiment: ' + experiment + ',\n   status: ' + status + ',\n   plateMaps: ' + plateMaps.length + '}\n\n ',
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
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};

function saveToKapture(experiment, plateMaps) {
    var wellsToSave = formatWells(experiment, plateMaps);
    axios.post(url,
        {
            experimentName: experiment,
            wells: wellsToSave
        }, {
            headers: {"Authorization": `Bearer ${token}`}
        }
    )
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function formatWells(experiment, plateMaps) {
    var wellsToSave = [];
    plateMaps.forEach(function(plateMap){
        var thePlateMap = { id:null, plateNumber: plateMap.id, platePurpose:null, plateType:null };
        plateMap.data.forEach(function(row){
            var re0 = /[0-9]/g;
            var re1 = /[a-zA-Z]/g;
            row.forEach(function (cell){
                var rowLabel = cell.id.replace(re0,'');
                var colLabel= cell.id.replace(re1,'');
                var theSample = { id:null, label: experiment+".p"+plateMap.id+"."+cell.id };
                var theWell = { id: null, platemap:thePlateMap, sample:theSample, row: rowLabel, column: colLabel };
                wellsToSave.push( theWell );
            });
        });
    });
    return wellsToSave;
}