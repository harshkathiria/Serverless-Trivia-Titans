// Import the AWS SDK and create a DynamoDB DocumentClient object
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

// The main Lambda function that will be invoked by AWS Lambda
exports.handler = async (event) => {

    // Define headers for the HTTP response
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };

    // Define the query to get all data from the DynamoDB table named 'Teams'
    const getUserData = {
        TableName: 'Teams', // Name of the DynamoDB table to query
    };

    // Use the DocumentClient's scan method to fetch all data from DynamoDB
    const result = await documentClient.scan(getUserData).promise();

    // Prepare the response object with the fetched data
    const response = {
        statusCode: 200,
        body: JSON.stringify(result.Items), // Convert the fetched data to JSON string and store it in the response body
        headers
    };

    // Log the response for debugging purposes
    console.log(response);

    // Return the response object containing the result of the operation
    return response;
};