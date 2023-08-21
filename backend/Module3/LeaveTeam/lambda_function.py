import json
import boto3

def lambda_handler(event, context):
    # Get the input parameters from the event
    u_email = event.get('u_email', '')
    t_id = event.get('t_id', '')

    # Retrieve the item from the TeamDetails table based on t_id
    dynamodb = boto3.resource('dynamodb')
    team_details_table = dynamodb.Table('TeamDetails')

    try:
        response = team_details_table.scan(
            FilterExpression='t_id = :t_id',
            ExpressionAttributeValues={':t_id': t_id}
        )
        teams_with_t_id = response['Items']
    except Exception as e:
        print(f"Error querying TeamDetails table for t_id '{t_id}': {e}")
        return {
            "statusCode": 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            "body": json.dumps({"message": "Internal Server Error"}),
        }

    if not teams_with_t_id:
        return {
            "statusCode": 404,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            "body": json.dumps({"message": "Team not found"}),
        }

    # Get the first item with the matching t_id (should be unique)
    team_details_item = teams_with_t_id[0]

    # Check if u_email is present in the members list
    members = team_details_item.get('members', [])
    if u_email not in members:
        return {
            "statusCode": 404,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            "body": json.dumps({"message": "User is not a member of the team"}),
        }

    # Remove u_email from the members list
    members.remove(u_email)

    # Check if u_email is in the admin column and update it if needed
    admin = team_details_item.get('admin', '')
    if admin == u_email:
        if len(members) > 0:
            admin = members[0]
        else:
            admin = ''  # If there are no members left, set admin to an empty string

    # Update the item in the TeamDetails table
    try:
        response = team_details_table.update_item(
            Key={'t_id': t_id},
            UpdateExpression='SET #m = :members, admin = :admin',
            ExpressionAttributeNames={'#m': 'members'},
            ExpressionAttributeValues={':members': members, ':admin': admin},
        )
    except Exception as e:
        print(f"Error updating TeamDetails for t_id '{t_id}': {e}")
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
        "body": json.dumps({"message": "User removed from the team successfully"}),
    }
