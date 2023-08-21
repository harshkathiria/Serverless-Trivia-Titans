const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamoHelper = require("../utils/dynamo.helper");
const common = require("./common");
const DYNAMO_QUIZ_REG_TABLE = "quiz-participation"
module.exports.handler = async (event) => {
    const { quizId } = JSON.parse(event.body);
    console.log(quizId);
    try{
        const items = await dynamoHelper.fetchEntriesByQuizId(dynamoDB, quizId, DYNAMO_QUIZ_REG_TABLE);
        return {
            statusCode: 200,
            body: JSON.stringify(items),
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