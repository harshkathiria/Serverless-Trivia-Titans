// Import the AWS SDK and create a DynamoDB DocumentClient object
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

// The main Lambda function that will be invoked by AWS Lambda
exports.handler = async (event) => {
    
    // Parse the JSON data from the event's body
    let body = JSON.parse(event.body);

    // Prepare the user data to be stored in the DynamoDB table
    let userData = {
        TableName: 'ProfileData', // Name of the DynamoDB table
        Item: {
            userId: body.userId, // User ID extracted from the request body
            userPhoto: body.photo, // User's photo information extracted from the request body
            userFName: body.fname, // User's first name extracted from the request body
            userLName: body.lname, // User's last name extracted from the request body
            userContact: body.contact, // User's contact information extracted from the request body
            userProfile: body.picture, // User's profile picture information extracted from the request body
            userEmail: body.email, // User's email information extracted from the request body
        }
    };

    // Call the dynamoPUT function to put the userData into DynamoDB table
    let dynamoDB = await dynamoPUT(userData).then(res => res).catch(err => {
        console.log(err);
        return err;
    });

    // Prepare the response object with the stored userData
    const response = {
        statusCode: 200,
        body: JSON.stringify(userData.Item), // Convert userData to JSON string and store it in the response body
    };

    // Log the response for debugging purposes
    console.log(response);

    // Return the response object containing the stored userData
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