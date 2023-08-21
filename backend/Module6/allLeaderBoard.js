import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

export const handler = async (event) => {
  const client = new DynamoDBClient({ region: "us-east-1" }); // Replace "us-east-1" with your desired AWS region
  const tableName = "TeamLeaderBoardLatest";
  const scanParams = {
    TableName: tableName,
  };
  const scanCommand = new ScanCommand(scanParams);
  
  try {
    const data = await client.send(scanCommand);
    const transformedData = transformToKeyValue(data.Items);
    return transformedData;
  } catch (error) {
    console.error("Error fetching records from DynamoDB:", error);
    throw error;
  }
};

function transformToKeyValue(records) {
  return records.map((record) => {
    const transformedRecord = {};
    for (const key in record) {
      const value = record[key].S;
      transformedRecord[key] = value;
    }
    return transformedRecord;
  });
}