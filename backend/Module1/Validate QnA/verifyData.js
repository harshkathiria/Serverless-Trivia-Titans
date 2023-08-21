// Import the AWS SDK and create a DynamoDB DocumentClient object
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

// The main Lambda function that will be invoked by AWS Lambda
exports.handler = async (event) => {

    // Parse the JSON data from the event's body
    let body = JSON.parse(event.body);
    
    // Extract the user and answer from the request body
    const user = body.userId;
    const answer = body.answer;

    // Define headers for the HTTP response
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };

    // Define the query to get all user data from the DynamoDB table
    const getUserData = {
        TableName: 'UserDetails', // Name of the DynamoDB table
    };

    // Use the DocumentClient's scan method to fetch all data from DynamoDB
    const result = await documentClient.scan(getUserData).promise();

    // Initialize a flag variable to track if any match is found
    var flag = false;

    // Loop through the result items and check for a match
    result.Items.map((i) => {
        if (i.userId == user) { // Check if the userId matches the requested user
            if (i.userFood == answer || i.userFriend == answer || i.userBirth == answer) {
                // If any of the userFood, userFriend, or userBirth match the provided answer, set the flag to true
                flag = true;
            }
        }
    });

    // Prepare the response object with the result
    const response = {
        statusCode: 200,
        body: JSON.stringify({ flagValue: flag }), // Convert flag to JSON string and store it in the response body
        headers
    };

    // Log the response for debugging purposes
    console.log(response);

    // Return the response object containing the result of the operation
    return response;
};