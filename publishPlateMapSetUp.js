'use strict';
require('dotenv').config();
var AWS = require("aws-sdk");
var sns = new AWS.SNS();
var axios = require("axios");

const http = process.env.KAPTURE_SERVER.startsWith('localhost')? 'http://' : 'https://';
const url = http + process.env.KAPTURE_SERVER + '/api/external-integrations/atlas';
//const url = "https://kapture-staging.apps.kaleidobio.com/api/external-integrations/atlas"
const authenticate_url = 'https://kapture.apps.kaleidobio.com/api/authenticate';
const username = process.env.KAPTURE_USERNAME;
const password = process.env.KAPTURE_PASSWORD;

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));
        console.log('eventType', record.eventName);
        var image = record.dynamodb.NewImage ? record.dynamodb.NewImage : record.dynamodb.OldImage;

        var experiment_status = image.experiment_status && image.experiment_status.S ? image.experiment_status.S : null;
        var experiment = (experiment_status.split("_"))[0];
        var status = (experiment_status.split("_"))[1];
        var version = image.version && image.version.N ? image.version.N : null;
        var plateMaps = image.plateMaps && image.plateMaps.S ? JSON.parse(image.plateMaps.S) : null;
        if (record.eventName === 'INSERT' && version > 0 && status === 'COMPLETED' ) {
            var p1 = new Promise(function(resolve, reject) {
                axios.post(authenticate_url,
                    {
                        "password": password,
                        "rememberMe": true,
                        "username": username
                    }
                )
                    .then(function (response) {
                        resolve(response.data.id_token);
                    })
                    .catch(function (error) {
                        console.log("Authentication Failed");
                        reject(error)
                    });
            });
            p1.then(function (token){
                saveToKapture(experiment, plateMaps, status, token);
            });
        }
    });
    callback(null, `processed ${event.Records.length} records.`);
};

function saveToKapture(experiment, plateMaps, status, token) {
    var wellsToSave = formatWells(experiment, plateMaps);
    axios.post(url,
        {
            experiment: experiment,
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
                cell.components.forEach(function (x){
                    if (x["timepoints"]){
                        (x["timepoints"]).forEach(function (t){
                            t["concentrationUnit"] = "%";
                        })
                    }
                });
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
