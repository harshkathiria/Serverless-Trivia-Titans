import json
import boto3

def lambda_handler(event, context):
    # Retrieve query parameters from the API link
    print(event)
    query_params = event.get('queryStringParameters', {})
    user_email = query_params.get('email', '')
    p_id = query_params.get('team', '')
    action = query_params.get('action', '')
    # query_params = event['queryStringParameters']
    # user_email = query_params['email']
    # team_id = query_params['team']
    print("team_id",p_id)
    print("action",action)
    print("email",user_email)
    data_type = type(p_id).__name__
    print("data_type",data_type)
    # action = query_params['action']

    # Update the status of the user based on the 'action' parameter
    dynamodb = boto3.resource('dynamodb')
    p_status_table = dynamodb.Table('PlayerStatusDetails')

    if action == 'accept':
        # Update the status of the user to "accepted" in the p_status table
        p_status_table.update_item(
            Key={
                'p_id': p_id
            },
            UpdateExpression='SET #st = :status',
            ExpressionAttributeNames={
                '#st': 'status'
            },
            ExpressionAttributeValues={
                ':status': 'accepted'
            }
        )
        # Query the 'Teams' table to find the 't_name' associated with the given 't_id'
        # teams_table = dynamodb.Table('Teams')
        response = p_status_table.scan(
            FilterExpression='p_id = :p_id',
            ExpressionAttributeValues={':p_id': p_id}
        )

        # Get the 't_name' from the response (assuming 't_name' exists in the response)
        team_item = response.get('Items')
        if team_item:
            t_id = team_item[0]['t_id']
            # Update the members list for the team with the found 't_name'
            teams_table = dynamodb.Table('TeamDetails')
            teams_table.update_item(
                Key={
                    't_id': t_id
                },
                UpdateExpression='SET #mem = list_append(#mem, :user)',
                ExpressionAttributeNames={
                    '#mem': 'members'
                },
                ExpressionAttributeValues={
                    ':user': [user_email]
                }
            )
            response_message = 'Invitation accepted successfully!'
        else:
            response_message = 'Team not found.'
    elif action == 'reject':
        # Update the status of the user to "rejected" in the p_status table
        p_status_table.update_item(
            Key={
                'p_id': p_id
            },
            UpdateExpression='SET #st = :status',
            ExpressionAttributeNames={
                '#st': 'status'
            },
            ExpressionAttributeValues={
                ':status': 'rejected'
            }
        )
        response_message = 'Invitation rejected!'
    else:
        response_message = 'Invalid action specified. Use "accept" or "reject" in the action parameter.'

    # Return a response indicating the result of the action (accept or reject)
    response = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(response_message)
    }
    return response
