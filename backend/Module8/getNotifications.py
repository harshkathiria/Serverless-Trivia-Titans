import json
import boto3

region = 'us-east-1'
dynamodb_table_name = 'notifications'

# Initialize the DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name=region)

# Lambda function entry point
def lambda_handler(event, context):
    try:
        # Get the reference to the DynamoDB table using its name
        table = dynamodb.Table(dynamodb_table_name)

        # Perform a scan operation to retrieve all items from the table
        response = table.scan()

        # Extract the items from the response
        items = response['Items']

        # Define CORS headers to allow cross-origin requests
        headers = {
            'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
            'Access-Control-Allow-Headers': 'Content-Type',  # Allow 'Content-Type' header
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allow these HTTP methods
        }

        # Return a successful response with the retrieved items as JSON
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(items)
        }
    except Exception as e:
        # Return an error response if any exception occurs during the process
        # Note: The 'headers' variable should be defined even in case of an error
        headers = {
            'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
            'Access-Control-Allow-Headers': 'Content-Type',  # Allow 'Content-Type' header
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allow these HTTP methods
        }

        return {
            'statusCode': 500,
            'headers': headers,
            'body': 'Error retrieving data from DynamoDB. ' + str(e)
        }
