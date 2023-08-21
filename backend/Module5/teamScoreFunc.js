import { ApiGatewayManagementApi, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient, ListTablesCommand, PutItemCommand, QueryCommand, DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import axios from 'axios';

import { fromUtf8 } from "@aws-sdk/util-utf8-browser";

const connectionURL = "https://qedjpastwc.execute-api.us-east-1.amazonaws.com/production/@connection";

const client = new ApiGatewayManagementApi({ endpoint: connectionURL });

const sendScore = async (id, body) => {
     const command = new PostToConnectionCommand({
       ConnectionId: id,
       Data: fromUtf8(JSON.stringify(body))
    });
  try {
    await client.send(command);
  } catch (error) {
    console.log(error);
  }
}

const sendToAll = async (activeGameUsers, body) => {
  const all = activeGameUsers.map(user => sendScore(user.connectionId, body));
  return Promise.all(all);
};

const saveConnection = async (payload) => {
       const client = new DynamoDBClient({});
       const docClient = DynamoDBDocumentClient.from(client);
      const saveObj = {
    TableName: 'TeamScoreConnections',
    Item: payload,
  };
      const command = new PutCommand(saveObj);
      let response = {};
        try {
      const result = await docClient.send(command);
      response = {
       statusCode: 200,
       message: "Successful!!",
       body: result,
     };
  } catch (error) {
    console.error('Error saving connection:', error);
     response = {
      statusCode: 400,
      message: "Error Bad Request!",
    };
    throw error;
  }
   return response;
};

const deleteConnection = async (payload) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const deleteObj = {
    TableName: 'TeamScoreConnections',
    Key: {
      connectionId:payload.connectionId
    }, 
  };
  const command = new DeleteCommand(deleteObj);
  try {
    const result = await docClient.send(command);
    return result;
  } catch (error) {
    console.error('Error deleting connection:', error);
    throw error;
  }
};

const calculateIndividualWinner = async (payload) => {
  const quizId = payload.quizId;
  const dynamoDBClient = new DynamoDBClient();
  const params = {
    TableName: "TeamAnswers",
    KeyConditionExpression: "quizId = :quizId",
    ExpressionAttributeValues: {
      ":quizId": { S: quizId }
    }
  };

  try {
    const command = new QueryCommand(params);
    const response = await dynamoDBClient.send(command);
    const teamScores = {};
    const userScores = {};
    let overAllData = transformToKeyValue(response.Items);
    console.log("RESPONSE ITEMSSS", response.Items);
    response.Items.forEach((item) => {
      const teamId = item.teamId.S;
      const teamDetail = item.teamDetail.M;
      const userDetail = item.userDetail.M;
      const userId = item.userId.S;
      const marks = parseFloat(item.marks.S);

      if (teamScores.hasOwnProperty(teamId)) {
        teamScores[teamId] += marks;
      } else {
        teamScores[teamId] = marks;
      }
      
      teamScores[teamId] = {teamDetail : teamDetail};
      
      if (userScores.hasOwnProperty(teamId)) {
        if (userScores[teamId].hasOwnProperty(userId)) {
          userScores[teamId][userId] += marks;
        } else {
          userScores[teamId][userId] = marks;
        }
      } else {
        userScores[teamId] = { [userId]: marks };
      }
       userScores[teamId][userId] = {userDetail : userDetail};
    });
    
    
    const sortedTeams = Object.entries(teamScores)
      .map(([teamId, totalMarks,teamDetail]) => ({
        teamId,
        totalMarks,
        teamDetail,
        users: Object.entries(userScores[teamId]).map(([userId, marks,userDetail]) => ({ userId, marks,userDetail })) // Changed this line to include userId and marks in each user object
      }))
      .sort((a, b) => b.totalMarks - a.totalMarks)
      .slice(0, 5);

    sortedTeams.forEach((team) => {
      team.users.sort((a, b) => b.marks - a.marks);
    });
    return sortedTeams;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

function transformToKeyValue(data) {
  const result = [];
  data.forEach((item) => {
    const transformedItem = {};
    Object.entries(item).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        transformedItem[key] = Object.values(value)[0];
      } else {
        transformedItem[key] = value;
      }
    });

    result.push(transformedItem);
  });

  return result;
}

export const handler = async(event) => {
     let result = {};
    if (event.requestContext) {
    try {
        const connectionId = event.requestContext.connectionId;
        const routeKey = event.requestContext.routeKey;
        let body = {};
            if(event.body){
                body = event.body;
            }
            switch(routeKey){
        case '$connect':
            body = event.queryStringParameters;
            const teamId = body?.teamId;
            const userId = body?.userId;
            const currentUserEmail = body?.email;
            const teamReponse = await axios.post("https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/getuserteamdetails",{u_email : currentUserEmail });//currentUserEmail
        let teamDetail = teamReponse?.data?.body?.data.map(team => {
          return {
            teamName: team.t_name,
            teamId: team.t_id,
            members: team.members,
            admin:team.admin,
          }
        });
          const customHeader = {
            'Content-Type': 'application/json'
        }
        const userResponse = await axios.get("https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/getProfileData",{headers: customHeader});
        let userDetail = userResponse?.data.map(user => {
          return {
           userContact:user.userContact,
           userName:user.userFName + " " + user.userLName,
           userId: user.userId
          }
        });
              const uDetail = userDetail.filter(user => user.userId == userId);
              const connectPayload = {quizId:body?.quizId, userId:body?.userId,connectionId:connectionId,'teamId#userId':`${body?.teamId}#${body?.userId}`,teamId: body?.teamId, userId: body?.userId,teamDetail:teamDetail[0], userDetail:uDetail[0]};
              result = await saveConnection(connectPayload);//CHECK THIS METHOD DB TABLE
            break;
        case '$disconnect':// not working
            const disconnectPayload = {connectionId:connectionId};
            result = await deleteConnection(disconnectPayload);
            console.log("DisConnect Case executed");
            break;
        case '$default':
            console.log("$default Case executed");
            break;
        case 'miscRoute':
            const quizId = event?.body?.quizId;
            let currentTeamId = event?.body?.teamId;
            const currentUserId = event?.body?.userId;
            const data = await calculateIndividualWinner({quizId: quizId, teamId:currentTeamId, userId:currentUserId}); 
            const activeGameUsers = await getAllDataByQuizId(quizId);//NEED TO IMPLEMENT THIS METHOD
            const transformedActiveGameUsers = transformNewDynamoDBResult(activeGameUsers);//NEED TO IMPLEMENT THIS METHOD
            result = await sendToAll(transformedActiveGameUsers, data);
            break;
        default:
    }
    }catch(err){
        console.error(err);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
    };
    return response;
  }
};

const getAllDataByQuizId = async (quizId) => {
  const client = new DynamoDBClient({ region: "us-east-1" });
  const TableName = "TeamScoreConnections";
  const params = {
    TableName,
    IndexName: "quizId-index", 
    KeyConditionExpression: "quizId = :quizIdValue", 
    ExpressionAttributeValues: {
      ":quizIdValue": { S: quizId }, 
    },
  };

  const command = new QueryCommand(params);

  try {
    const data = await client.send(command);
    console.log("Query results:", data.Items);
    return data.Items; 
  } catch (error) {
    console.error("Error querying the table:", error);
    return []; 
  }
};

const transformNewDynamoDBResult = (activeGameUsers) => {
  const transformedResult = activeGameUsers.map((record) => {
    const transformedRecord = {};

    Object.keys(record).forEach((key) => {
      const valueObj = record[key];

      if (valueObj.hasOwnProperty("S")) {
        transformedRecord[key] = valueObj.S;
      } else if (valueObj.hasOwnProperty("N")) {
        transformedRecord[key] = Number(valueObj.N);
      } else if (valueObj.hasOwnProperty("M")) {
        transformedRecord[key] = transformNewDynamoDBResult([valueObj.M])[0];
      } else if (valueObj.hasOwnProperty("L")) {
        transformedRecord[key] = valueObj.L.map((item) =>
          item.hasOwnProperty("M") ? transformNewDynamoDBResult([item.M])[0] : null
        );
      } else {
        transformedRecord[key] = null;
      }
    });

    return transformedRecord;
  });

  return transformedResult;
};