#!/bin/sh
curl -H "Content-Type: application/json" \
  -X POST \
-d '{
  "Records": [
    {
      "eventID": "7de3041dd709b024af6f29e4fa13d34c",
      "eventName": "MODIFY",
      "eventVersion": "1.1",
      "eventSource": "aws:dynamodb",
      "awsRegion": "us-west-1",
      "dynamodb": {
        "ApproximateCreationDateTime": 1479499740,
        "NewImage": {
          "experiment": {
            "S": "G888"
          },
          "status": {
            "S": "COMPLETE"
          },
          "data": {
            "S": "TESTING"
          },
          "plateMaps": {
            "S": "[{\"id\":1,\"data\":[[{\"id\":\"A1\",\"components\":[{\"type\":\"community\",\"id\":3201,\"timepoints\":[{\"time\":0,\"concentration\":1}]},{\"type\":\"medium\",\"id\":52183400,\"timepoints\":[{\"time\":0,\"concentration\":null}]},{\"type\":\"supplement\",\"id\":1970585,\"timepoints\":[{\"time\":0,\"concentration\":0.5}]}]}]]}]"
          }
        },
        "SequenceNumber": "13021600000000001596893679",
        "SizeBytes": 112,
        "StreamViewType": "NEW_IMAGE"
      },
      "eventSourceARN": "arn:aws:dynamodb:us-east-1:001507046168:table/atlas-development/stream/2019-08-21T15:57:58.492"
    }
  ]
}' \
  http://localhost:10000