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
            "S": "G111_COMPLETED"
          },
          "version": {
            "N": 1
          },
          "data": {
            "S": "TESTING"
          },
          "plateMaps": {
            "S": "[{\"id\":1,\"data\":[[{\"id\":\"A1\",\"components\":[{\"type\":\"medium\",\"id\":1451,\"timepoints\":[{\"time\":0,\"concentration\":null}]},{\"type\":\"supplement\",\"id\":1970585,\"timepoints\":[{\"time\":0,\"concentration\":0.5}]},{\"type\":\"compound\",\"id\":1860,\"timepoints\":[{\"time\":0,\"concentration\":0.5}]},{\"type\":\"community\",\"id\":3201,\"timepoints\":[{\"time\":0,\"concentration\":1}]}]},{\"id\":\"A2\",\"components\":[{\"type\":\"medium\",\"id\":1451,\"timepoints\":[{\"time\":0,\"concentration\":null}]},{\"type\":\"supplement\",\"id\":1970585,\"timepoints\":[{\"time\":0,\"concentration\":0.5}]},{\"type\":\"compound\",\"id\":1860,\"timepoints\":[{\"time\":0,\"concentration\":0.5}]},{\"type\":\"community\",\"id\":3201,\"timepoints\":[{\"time\":0,\"concentration\":1}]}]},{\"id\":\"A3\",\"components\":[{\"type\":\"medium\",\"id\":1451,\"timepoints\":[{\"time\":0,\"concentration\":null}]},{\"type\":\"supplement\",\"id\":1970585,\"timepoints\":[{\"time\":0,\"concentration\":0.5}]},{\"type\":\"compound\",\"id\":1860,\"timepoints\":[{\"time\":0,\"concentration\":0.5}]},{\"type\":\"community\",\"id\":3201,\"timepoints\":[{\"time\":0,\"concentration\":1}]}]},{\"id\":\"A4\",\"components\":[]},{\"id\":\"A5\",\"components\":[]},{\"id\":\"A6\",\"components\":[]},{\"id\":\"A7\",\"components\":[]},{\"id\":\"A8\",\"components\":[]},{\"id\":\"A9\",\"components\":[]},{\"id\":\"A10\",\"components\":[]},{\"id\":\"A11\",\"components\":[]},{\"id\":\"A12\",\"components\":[]}],[{\"id\":\"B1\",\"components\":[]},{\"id\":\"B2\",\"components\":[]},{\"id\":\"B3\",\"components\":[]},{\"id\":\"B4\",\"components\":[]},{\"id\":\"B5\",\"components\":[]},{\"id\":\"B6\",\"components\":[]},{\"id\":\"B7\",\"components\":[]},{\"id\":\"B8\",\"components\":[]},{\"id\":\"B9\",\"components\":[]},{\"id\":\"B10\",\"components\":[]},{\"id\":\"B11\",\"components\":[]},{\"id\":\"B12\",\"components\":[]}],[{\"id\":\"C1\",\"components\":[]},{\"id\":\"C2\",\"components\":[]},{\"id\":\"C3\",\"components\":[]},{\"id\":\"C4\",\"components\":[]},{\"id\":\"C5\",\"components\":[]},{\"id\":\"C6\",\"components\":[]},{\"id\":\"C7\",\"components\":[]},{\"id\":\"C8\",\"components\":[]},{\"id\":\"C9\",\"components\":[]},{\"id\":\"C10\",\"components\":[]},{\"id\":\"C11\",\"components\":[]},{\"id\":\"C12\",\"components\":[]}],[{\"id\":\"D1\",\"components\":[]},{\"id\":\"D2\",\"components\":[]},{\"id\":\"D3\",\"components\":[]},{\"id\":\"D4\",\"components\":[]},{\"id\":\"D5\",\"components\":[]},{\"id\":\"D6\",\"components\":[]},{\"id\":\"D7\",\"components\":[]},{\"id\":\"D8\",\"components\":[]},{\"id\":\"D9\",\"components\":[]},{\"id\":\"D10\",\"components\":[]},{\"id\":\"D11\",\"components\":[]},{\"id\":\"D12\",\"components\":[]}],[{\"id\":\"E1\",\"components\":[]},{\"id\":\"E2\",\"components\":[]},{\"id\":\"E3\",\"components\":[]},{\"id\":\"E4\",\"components\":[]},{\"id\":\"E5\",\"components\":[]},{\"id\":\"E6\",\"components\":[]},{\"id\":\"E7\",\"components\":[]},{\"id\":\"E8\",\"components\":[]},{\"id\":\"E9\",\"components\":[]},{\"id\":\"E10\",\"components\":[]},{\"id\":\"E11\",\"components\":[]},{\"id\":\"E12\",\"components\":[]}],[{\"id\":\"F1\",\"components\":[]},{\"id\":\"F2\",\"components\":[]},{\"id\":\"F3\",\"components\":[]},{\"id\":\"F4\",\"components\":[]},{\"id\":\"F5\",\"components\":[]},{\"id\":\"F6\",\"components\":[]},{\"id\":\"F7\",\"components\":[]},{\"id\":\"F8\",\"components\":[]},{\"id\":\"F9\",\"components\":[]},{\"id\":\"F10\",\"components\":[]},{\"id\":\"F11\",\"components\":[]},{\"id\":\"F12\",\"components\":[]}],[{\"id\":\"G1\",\"components\":[]},{\"id\":\"G2\",\"components\":[]},{\"id\":\"G3\",\"components\":[]},{\"id\":\"G4\",\"components\":[]},{\"id\":\"G5\",\"components\":[]},{\"id\":\"G6\",\"components\":[]},{\"id\":\"G7\",\"components\":[]},{\"id\":\"G8\",\"components\":[]},{\"id\":\"G9\",\"components\":[]},{\"id\":\"G10\",\"components\":[]},{\"id\":\"G11\",\"components\":[]},{\"id\":\"G12\",\"components\":[]}],[{\"id\":\"H1\",\"components\":[]},{\"id\":\"H2\",\"components\":[]},{\"id\":\"H3\",\"components\":[]},{\"id\":\"H4\",\"components\":[]},{\"id\":\"H5\",\"components\":[]},{\"id\":\"H6\",\"components\":[]},{\"id\":\"H7\",\"components\":[]},{\"id\":\"H8\",\"components\":[]},{\"id\":\"H9\",\"components\":[]},{\"id\":\"H10\",\"components\":[]},{\"id\":\"H11\",\"components\":[]},{\"id\":\"H12\",\"components\":[]}]]}]"
          }
        },
        "SequenceNumber": "13021600000000001596893679",
        "SizeBytes": 112,
        "StreamViewType": "NEW_IMAGE"
      },
      "eventSourceARN": "arn:aws:dynamodb:us-east-1:001507046168:table/atlas-staging/stream/2019-08-21T15:57:58.492"
    }
  ]
}' \
  http://localhost:10000