import { DynamoDBClient, ListTablesCommand, PutItemCommand, QueryCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event) => {
  try {
    let payload = event;
    const result = await submitAnswer(payload);
    return result;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Internal Server Error'),
    };
  }
};

const submitAnswer = async (payload) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  const TeamAnswerObj = {
    TableName: "TeamAnswers",
    Item: payload
  };
  const command = new PutCommand(TeamAnswerObj);
  let response = {};
  try {
    const result = await docClient.send(command);
    response = {
      statusCode: 200,
      message: "Successful!!",
      body: result,
    };
  } catch (error) {
    console.error('Error saving details:', error);
    response = {
      statusCode: 400,
      message: "Error Bad Request!",
    };
    throw error;
  }
    return response;
};

const createTable = async () => {
const REGION = "us-east-1";
const TableName = "TeamAnswers";
const client = new DynamoDBClient({ region: REGION });
  const params = {
    TableName,
    KeySchema: [
      { AttributeName: "quizId", KeyType: "HASH" },
      { AttributeName: "teamId#userId#questionId", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
      { AttributeName: "quizId", AttributeType: "S" },
      { AttributeName: "teamId#userId#questionId", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };
  const command = new CreateTableCommand(params);

  try {
    const data = await client.send(command);
  } catch (error) {
    console.error("Error creating table:", error);
  }
};