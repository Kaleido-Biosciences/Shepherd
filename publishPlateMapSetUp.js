'use strict';
require('dotenv').config();
let AWS = require("aws-sdk");
let sns = new AWS.SNS();
let axios = require("axios");
let lzutf8 = require("lzutf8");
let pako = require("pako");

const http = process.env.KAPTURE_SERVER.startsWith('localhost')? 'http://' : 'https://';
const url = http + process.env.KAPTURE_SERVER + '/api/external-integrations/atlas';
//const url = "https://kapture-staging.apps.kaleidobio.com/api/external-integrations/atlas"
const authenticate_url = 'https://kapture.apps.kaleidobio.com/api/authenticate';
const username = process.env.KAPTURE_USERNAME;
const password = process.env.KAPTURE_PASSWORD;

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        try {
            console.log('Stream record: ', JSON.stringify(record, null, 2));
            console.log('eventType', record.eventName);
            let image = record.dynamodb.NewImage ? record.dynamodb.NewImage : record.dynamodb.OldImage;
            let experiment_status = image.experiment_status && image.experiment_status.S ? image.experiment_status.S : null;
            let experiment = (experiment_status.split("_"))[0];
            let status = (experiment_status.split("_"))[1];
            let version = image.version && image.version.N ? image.version.N : null;
            let plateMaps = image.plateMaps && image.plateMaps.S ? JSON.parse(lzutf8.decompress(image.plateMaps.S, {inputEncoding: "Base64"})) : null;
            if (record.eventName === 'INSERT' && version > 0 && status === 'COMPLETED') {
                let p1 = new Promise(function (resolve) {
                    axios.post(authenticate_url,
                      {
                          "password": password,
                          "rememberMe": true,
                          "username": username
                      }
                    )
                      .then(function (response) {
                          console.log("Authentication PASSED.....got token");
                          resolve(response.data.id_token);
                      })
                      .catch(function (error) {
                          console.log("Authentication FAILED.....for " + username);
                          console.log(authenticate_url);
                          console.log(error.valueOf());
                          resolve(null)
                      });
                });
                p1.then(function (token) {
                    if (token) {
                        saveToKapture(experiment, plateMaps, status, token);
                    }
                });
            }
        }
        catch (error){
            context.fail(error);
        }
    });
    callback(null, `processed ${event.Records.length} records.`);
};

function saveToKapture(experiment, plateMaps, status, token) {
    let wellsToSave = formatWells(experiment, plateMaps);
    // TODO: Most requests will be over 1024 bytes, however if we start to find this is not the case we should/could
    //       only compress the messages whose data is only over 1024 bytes
    axios.post(url,
        {
            experiment: experiment,
            wellWithComponents: pako.gzip(wellsToSave)
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Encoding": "gzip"}
        }
    )
        .then(function (response) {
            console.log(response);
            sendSNS(experiment, status, plateMaps.length, "Shepherd SUCCEED in publishing to " + process.env.KAPTURE_SERVER);
        })
        .catch(function (error) {
            console.log(error);
            sendSNS(experiment, status, plateMaps.length, "Shepherd FAILED to publish to "+ process.env.KAPTURE_SERVER);
        });
}

function extractAttributes(components){
    let attributes = [];
    const attributeComponent = components.filter(c => c.type === 'attribute');
    attributeComponent.forEach(c => {
        if (c['attributeValues']) {
            attributes.push({
                key: c['attributeValues']['key'],
                value: c['attributeValues']['value'],
                value_type: c['attributeValues']['value_type'],
                value_unit: c['attributeValues']['value_unit'],
            })
        }
    });
    return attributes;
}

function formatWells(experiment, plateMaps) {
    let wellsToSave = [];
    plateMaps.forEach(function (plateMap) {
        var thePlateMap = {id: null, plateNumber: plateMap.id, platePurpose: null, plateType: null};
        plateMap.data.forEach(function (row) {
            let re0 = /[0-9]/g;
            let re1 = /[a-zA-Z]/g;
            row.forEach(function (cell) {
                let rowLabel = cell.id.replace(re0, '');
                let colLabel = cell.id.replace(re1, '');
                let theSample = {id: null, label: experiment + ".p" + plateMap.id + "." + cell.id};
                let theWell = {id: null, platemap: thePlateMap, sample: theSample, row: rowLabel, column: colLabel};
                let wellWithComponents = {
                    well: theWell,
                    wellComponents: cell.components.filter(c => c.type !=='attribute'),
                    attributes: extractAttributes(cell.components)
                };
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
