# Shepherd

Application that processes the platemaps as well as tracks sequencing plates and open wells

# Environment variables
* During development, please add a .env file that contains the following properties:

  KAPTURE_JWT_TOKEN=replace_with_a_valid_token

* During deployment, create the lambda function with the --environment attribute
  ```
  aws lambda create-function \
      --region us-east-1 \
      --function-name publishPlateMapSetUp \
      --zip-file fileb://publishPlateMapSetUp.zip \
      --role arn:aws:iam::001507046168:role/service-role/DynamoDBKickingLambdaRole \
      --handler publishPlateMapSetUp.handler \
      --timeout 5 \
      --runtime nodejs10.x
      --environment Variables="{KAPTURE_JWT_TOKEN=replace_with_a_valid_token}" 
  ```


# To start the lambda function
  - npm install
  - npm start

If you are using Webstorm, you can also start and debug using the following set up

![alt text](https://gitlab.kaleidobio.com/research/shepherd/blob/issue/1/images/webstorm_config.png)

# Testing 
The Lambda function can be tested locally by running ./test.sh in Terminal. 


