const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamoHelper = require("../utils/dynamo.helper");
const common = require("./common");
const DYNAMO_QUIZ_REG_TABLE = "quiz-participation"
module.exports.handler = async (event) => {
    console.log(event);
    const {quizId, userId, email} = JSON.parse(event.body);
    console.log(quizId, userId, email);
    try{
        await dynamoHelper.putItemToDynamoDB(dynamoDB, {quizId: quizId, userId: userId, email: email}, DYNAMO_QUIZ_REG_TABLE);
        return {
            statusCode: 200,
            body: JSON.stringify({message: "Registration Successful"}),
            headers: common.headers
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Internal Server Error"}),
            headers: common.headers
        }
    }
}