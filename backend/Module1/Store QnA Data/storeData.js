// Import the AWS SDK and create a DynamoDB DocumentClient object
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

// The main Lambda function that will be invoked by AWS Lambda
exports.handler = async (event) => {

    // Parse the JSON data from the event's body
    let body = JSON.parse(event.body);

    // Create a response object with an initial status code of 200 (OK)
    const response = {
        statusCode: 200,
    };

    // Prepare the data to be stored in the DynamoDB table
    let userData = {
        TableName: 'UserDetails', // Name of the DynamoDB table
        Item: {
            userId: body.userId, // User ID extracted from the request body
            userFood: body.food, // User's food information extracted from the request body
            userFriend: body.friend, // User's friend information extracted from the request body
            userBirth: body.birth, // User's birth information extracted from the request body
        }
    };

    // Call the dynamoPUT function to put the userData into DynamoDB table
    let dynamoDB = await dynamoPUT(userData).then(res => res).catch(err => {
        console.log(err);
        return err;
    });

    // Convert the DynamoDB response to a JSON string and set it as the response body
    response.body = JSON.stringify(dynamoDB);

    // Return the response object containing the result of the operation
    return response;
};

// Helper function to put data into DynamoDB using the DocumentClient's put method
function dynamoPUT(params) {

    // Return a Promise to handle the asynchronous operation
    return new Promise(function (resolve, reject) {
        // Use the DocumentClient's put method to store data in DynamoDB
        documentClient.put(params, function (err, data) {
            if (err) {
                // If there's an error, reject the Promise with the error
                reject(err);
            }
            else {
                // If the operation is successful, resolve the Promise with the data
                resolve(data);
            }
        });
    });
}