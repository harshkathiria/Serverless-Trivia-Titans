import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import axios from "axios";
const client = new DynamoDBClient({ region: "us-east-1" });
export const handler = async (event) => {
  const { teamId, categoryId, quizId } = event;
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  let response = {};
  
  try {
    const result = await getDataBasedOnTeamIdCategoryId({
      teamId: teamId,
      categoryId: categoryId,
    });
    const userScores = {};
    result.forEach((item) => {
      const userId = item.userId;
      const marks = parseFloat(item.marks);
      if (userScores[userId]) {
        userScores[userId] += marks;
      } else {
        userScores[userId] = marks;
      }
      userScores[userId] = item.userDetail;
      userScores[userId] = item.teamDetail;
    });

    for (const userId in userScores) {
      const score = userScores[userId];
      const userLeaderBoardRecordPayload = {
        teamId: teamId,
        categoryId: categoryId,
        quizId: quizId,
        score: score,
        timestamp: formattedDate,
        "categoryId#userId": `${categoryId}#${userId}`,
      };
      try {
        await saveUserLeaderboardRecord(userLeaderBoardRecordPayload); //CREATE USER LEADER BOARD
      } catch (e) {
        console.log("Error occured while generating User Leaderboard");
      }

      const userDetails = allUsersInaTeam.find((user) => user.userId == userId);
      const userAnalysisData = {
        ...userDetails,
        ...teamDetails,
        score: score.toFixed(2),
        timestamp: formattedDate,
      };

      const userCloudFunctionPayload = {
        categoryId: categoryId,
        userId: userId,
        data: userAnalysisData,
      };
      try{
        console.log("userCloudFunctionPayload", userCloudFunctionPayload);
        const googleCloudUserFunctionURL =
        "https://us-east1-csci5410-serverless-lab.cloudfunctions.net/userLeaderboard";
        await axios.post(googleCloudUserFunctionURL, userCloudFunctionPayload);
        console.log("Google UserLeaderBoardLatest Created");
      }catch(e){
        console.log("User Google Leadeboard endpoint error", e); 
      }
     
    }
    const totalMarks = result.reduce((acc, item) => {
      const marks = parseFloat(item.marks);
      return acc + marks;
    }, 0);

    const leaderBoardRecord = {
      teamId: teamId,
      categoryId: categoryId,
      quizId: quizId,
      score: totalMarks.toFixed(2),
      timestamp: formattedDate,
      "categoryId#teamId": `${categoryId}#${teamId}`,
    };
    console.log("leaderBoardRecord", leaderBoardRecord);

    const analysisData = {
      ...teamDetails,
      score: totalMarks,
      timestamp: formattedDate,
    };

    const cloudFunctionPayload = {
      categoryId: categoryId,
      teamId: teamId,
      data: analysisData,
    };
  
    try{
          const googleCloudFunctionURL =
          "https://us-east1-csci5410-serverless-lab.cloudfunctions.net/leaderBoardFunctionTwo";
          await axios.post(googleCloudFunctionURL, cloudFunctionPayload);
          console.log("Google TeamLeaderBoardLatest Created");
      }catch(e){
        console.log("Team Google Leadeboard endpoint error", e); 
      }
    const isLeaderBoardRecordCreated = await saveLeaderboardRecord(
      leaderBoardRecord
    );
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Leaderboard Creation", isLeaderBoardRecordCreated),
    };
  } catch (e) {
    console.log("Some error occured at Main level", e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Leaderboard Creation Failed"),
    };
  }
};

async function getDataBasedOnTeamIdCategoryId(event) {
  const params = {
    TableName: "TeamAnswers",
    IndexName: "teamId-categoryId-index",
    KeyConditionExpression:
      "teamId = :teamIdValue AND categoryId = :categoryIdValue",
    ExpressionAttributeValues: {
      ":teamIdValue": { S: event.teamId },
      ":categoryIdValue": { S: event.categoryId },
    },
  };

  const command = new QueryCommand(params);
  try {
    const response = await client.send(command);
    const processedResult = transformResult(response.Items);
    return processedResult || [];
  } catch (error) {
    console.error("Error querying the table:", error);
  }
}

const transformResult = (result) => {
  const transformedResult = result.map((item) => {
    const keyValueResult = {};
    for (const [key, value] of Object.entries(item)) {
      const dataType = Object.keys(value)[0];
      const dataValue = value[dataType];

      keyValueResult[key] = dataValue;
    }
    return keyValueResult;
  });
  return transformedResult;
};

export async function saveLeaderboardRecord(leaderBoardRecord) {
  console.log("leaderBoardRecord", leaderBoardRecord);
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  const params = {
    TableName: "TeamLeaderBoardLatest",
    Item: leaderBoardRecord,
  };
  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Error saving leaderboard record:", error);
    return false;
  }
}

export async function saveUserLeaderboardRecord(leaderBoardRecord) {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  const params = {
    TableName: "UserLeaderBoardLatest",
    Item: leaderBoardRecord,
  };
  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Error saving leaderboard record:", error);
    return false;
  }
}
