const getItemFromDynamoDB = async (dynamoDB, key, tableName) => {
  const params = {
    TableName: tableName,
    Key: key,
  };

  try {
    const response = await dynamoDB.get(params).promise();
    return response.Item;
  } catch (error) {
    console.error("Error retrieving item from DynamoDB:", error);
    throw error;
  }
};

const putItemToDynamoDB = async (dynamoDB, attributes, tableName) => {
  const params = {
    TableName: tableName,
    Item: attributes,
  };

  try {
    const response = await dynamoDB.put(params).promise();
  } catch (error) {
    console.error("Error Putting item to DynamoDB:", error);
    throw error;
  }
};

async function fetchEntriesByQuizId(dynamoDB, quizId, tableName) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "quizId = :quizId",
    ExpressionAttributeValues: {
      ":quizId": quizId,
    },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
}

const deleteRecordFromDynamoDB = async (dynamoDB, key, tableName) => {
  const params = {
    TableName: tableName,
    Key: key,
  };
  try {
    return await dynamoDB.delete(params).promise();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  putItemToDynamoDB: putItemToDynamoDB,
  getItemFromDynamoDB: getItemFromDynamoDB,
  fetchEntriesByQuizId: fetchEntriesByQuizId,
  deleteRecordFromDynamoDB: deleteRecordFromDynamoDB,
};
