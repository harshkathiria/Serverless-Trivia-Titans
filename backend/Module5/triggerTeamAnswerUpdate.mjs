import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';


const lambdaClient = new LambdaClient({ region: "us-east-1" });
export const handler = async (event, context) => {
  let jsonData= {};
  try {
    for(const record of event.Records){
      const recordData = record.dynamodb.NewImage;
      jsonData = unmarshall(recordData);
    }
    
    const teamScoreFuncPayload = {
        requestContext:{
          routeKey: 'miscRoute',
        },body:{
          quizId:jsonData.quizId,
          teamId: jsonData?.teamId,
          userId: jsonData?.userId
        }
    };
    const params = {
      FunctionName: 'arn:aws:lambda:us-east-1:797912155957:function:teamScoreFunc',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(teamScoreFuncPayload) 
    };

    const command = new InvokeCommand(params);
    const response = await lambdaClient.send(command);
    return { statusCode: 200, body: 'Lambda function invoked successfully' };
  } catch (error) {
    console.error('Error invoking Lambda function:', error);
    return { statusCode: 500, body: 'Error invoking Lambda function' };
  }
};
