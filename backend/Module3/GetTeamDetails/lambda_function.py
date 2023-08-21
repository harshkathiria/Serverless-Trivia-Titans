import json
import boto3

def lambda_handler(event, context):
    # Retrieve all items from the TeamDetails table
    dynamodb = boto3.resource('dynamodb')
    team_details_table = dynamodb.Table('TeamDetails')

    try:
        response = team_details_table.scan()
        teams = response['Items']
    except Exception as e:
        print(f"Error retrieving all teams from TeamDetails table: {e}")
        return {
            "statusCode": 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            "body": json.dumps({"message": "Internal Server Error"}),
        }

    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        "body": json.dumps({"teams": teams}),
    }
