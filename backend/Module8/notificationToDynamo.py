import json
import boto3

region = 'us-east-1'
dynamodb_table_name = 'notifications'

# Initialize the DynamoDB client
dynamodb = boto3.client('dynamodb', region_name=region)

# Function to create a DynamoDB table if it doesn't exist
def create_dynamodb_table():
    dynamodb.create_table(
        TableName=dynamodb_table_name,
        KeySchema=[
            {
                'AttributeName': 'username',
                'KeyType': 'HASH'  # 'HASH' key type indicates the partition key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'username',
                'AttributeType': 'S'  # 'S' indicates the attribute is of type string
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,    # Provisioned Read Capacity Units
            'WriteCapacityUnits': 5    # Provisioned Write Capacity Units
        }
    )
    dynamodb.get_waiter('table_exists').wait(TableName=dynamodb_table_name)

# Lambda function entry point
def lambda_handler(event, context):
    print(event)
    try:
        try:
            # Check if the DynamoDB table exists by trying to describe it
            dynamodb.describe_table(TableName=dynamodb_table_name)
        except dynamodb.exceptions.ResourceNotFoundException:
            # Create the table if it doesn't exist
            create_dynamodb_table()

        # Extract and process each record from the SQS event
        records = event['Records']
        for record in records:
            sqs_message_body = json.loads(record['body'])

            # Extract 'username' and 'message' from the SQS message body
            username = sqs_message_body['username']
            message = sqs_message_body['message']

            # Store the 'username' and 'message' as items in the DynamoDB table
            dynamodb.put_item(
                TableName=dynamodb_table_name,
                Item={
                    'username': {'S': username},  # 'S' indicates the attribute is of type string
                    'message': {'S': message}    # 'S' indicates the attribute is of type string
                }
            )

        return {
            'statusCode': 200,
            'body': 'Messages stored in DynamoDB successfully.'
        }
    except Exception as e:
        # Return an error response if any exception occurs during the process
        return {
            'statusCode': 500,
            'body': 'Error storing messages in DynamoDB. ' + str(e)
        }
