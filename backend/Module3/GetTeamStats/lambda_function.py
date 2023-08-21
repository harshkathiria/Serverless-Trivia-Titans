import json
import boto3
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)

def lambda_handler(event, context):
    # Get the u_email from the event
    u_email = event.get('u_email', '')

    # Query TeamDetails table to find t_id values containing the u_email in members list
    dynamodb = boto3.resource('dynamodb')
    team_details_table = dynamodb.Table('TeamDetails')

    try:
        response = team_details_table.scan(
            FilterExpression='contains(members, :email)',
            ExpressionAttributeValues={':email': u_email}
        )
        teams_with_u_email = response['Items']
    except Exception as e:
        print(f"Error querying TeamDetails table: {e}")
        return {
            "statusCode": 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            "body": json.dumps({"message": "Internal Server Error"}),
        }

    # Fetch rows from TeamStats using t_id values
    team_stats_table = dynamodb.Table('TeamStats')
    team_stats = []

    for team in teams_with_u_email:
        t_id = team['t_id']

        try:
            response = team_stats_table.query(
                KeyConditionExpression='t_id = :t_id',
                ExpressionAttributeValues={':t_id': t_id}
            )
            team_stats.extend(response['Items'])
        except Exception as e:
            print(f"Error fetching TeamStats for t_id '{t_id}': {e}")
            continue

    # Prepare the response
    response = {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        "body": json.dumps({"teams_stats": team_stats}, cls=DecimalEncoder),
    }

    return response
