#!/bin/sh
curl -H "Content-Type: application/json" \
  -X POST \
-d '{
  "Records": [
    {
      "eventID": "7de3041dd709b024af6f29e4fa13d34c",
      "eventName": "INSERT",
      "eventVersion": "1.1",
      "eventSource": "aws:dynamodb",
      "awsRegion": "us-west-1",
      "dynamodb": {
        "ApproximateCreationDateTime": 1479499740,
        "NewImage": {
          "experiment_status": {
            "S": "G680_COMPLETED"
          },
          "version": {
            "N": 1
          },
          "data": {
            "S": "TESTING"
          },
          "plateMaps": {
            "S": "SOME TEXT"
          }
        },
        "SequenceNumber": "13021600000000001596893679",
        "SizeBytes": 112,
        "StreamViewType": "NEW_IMAGE"
      },
      "eventSourceARN": "arn:aws:dynamodb:us-east-1:11111111111:table/atlas-staging/stream/2019-08-21T15:57:58.492"
    }
  ]
}' \
  http://localhost:10000