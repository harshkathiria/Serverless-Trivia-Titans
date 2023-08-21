import json
import re
import boto3
import uuid
from botocore.exceptions import ClientError

def get_u_id_from_email(email):
    data_type = type(email).__name__
    print(data_type)
    dynamodb = boto3.resource('dynamodb')
    table_name = 'User'  # Replace with your actual DynamoDB table name

    table = dynamodb.Table(table_name)

    # Scan the DynamoDB table to find the user with the provided email
    response = table.scan(
        FilterExpression='u_email = :email',
        ExpressionAttributeValues={':email': email}
    )

    # Check if a user with the provided email exists
    if 'Items' not in response or not response['Items']:
        print(f"ID not found for email: {email}")
        return None

    # Extract the u_id from the retrieved record
    u_id = response['Items'][0]['u_id']

    return u_id

def get_t_name_from_id(t_id):
    dynamodb = boto3.resource('dynamodb')
    table_name = 'TeamDetails'  # Replace with your actual DynamoDB table name

    table = dynamodb.Table(table_name)

    # Scan the DynamoDB table to find the team with the provided name
    response = table.scan(
        FilterExpression='t_id = :t_id',
        ExpressionAttributeValues={':t_id': t_id}
    )

    # Check if a team with the provided name exists
    if 'Items' not in response or not response['Items']:
        print(f"Team not found with name: {t_id}")
        return None

    # Extract the t_id from the retrieved record
    t_name = response['Items'][0]['t_name']

    return t_name

def lambda_handler(event, context):
    sqs_client = boto3.client('sqs')

    for record in event['Records']:
        message_body = json.loads(record['body'])
        t_id = message_body['t_id']
        user_email = message_body['user_email']

        u_id = get_u_id_from_email(user_email)
        if u_id:
            t_name = get_t_name_from_id(t_id)
            if t_name:
                p_id = str(uuid.uuid4())
                add_player_status_entry(u_id, p_id, t_id, t_name, "pending", user_email)
                print(f"Added player status for u_id: {u_id}, t_id: {t_id}")

                try:
                    send_invitation_email(user_email, t_name, p_id)
                    print(f"Sent invitation email to: {user_email}")
                except ClientError as e:
                    if e.response['Error']['Code'] == 'InvalidParameter':
                        print("Invalid parameter when calling the Publish operation.")
                        # Handle the error here or log it for debugging purposes
                        # Optionally, you can raise an exception to stop the Lambda from retrying
                        raise
                    else:
                        print("Unexpected error:", e)
                        raise


def add_player_status_entry(u_id, p_id, t_id, t_name, status, u_email):
    dynamodb = boto3.resource('dynamodb')
    table_name = 'PlayerStatusDetails'  # Replace with your actual DynamoDB table name
    table = dynamodb.Table(table_name)
    # PutItem to add a new entry in the PlayerStatus table
    response = table.put_item(
        Item={
            'p_id': p_id,
            'u_id': u_id,
            't_id': t_id,
            'u_email': u_email,
            't_name': t_name,
            'status': status
        }
    )

def send_invitation_email(user_email, t_name, p_id):
    # Customize the email message and links based on t_name and user_email
    subject = f'Invitation to join team {t_name}'
    message = f'Hello, you have been invited to join the team {t_name}. Click the links below to accept or reject the invitation.\n\n'
    accept_link = f'https://8zeda73qq4.execute-api.us-east-1.amazonaws.com/first/handleinvitationtest?team={p_id}&email={user_email}&action=accept'
    reject_link = f'https://8zeda73qq4.execute-api.us-east-1.amazonaws.com/first/handleinvitationtest?team={p_id}&email={user_email}&action=reject'
    message += f'Accept: {accept_link}\n'
    message += f'Reject: {reject_link}'

    # Subscribe the user's email address to the SNS topic
    sns_client = boto3.client('sns')
    topic_name = f'EmailSubscription-{re.sub(r"[^a-zA-Z0-9]", "", user_email)}'
    response = sns_client.create_topic(Name=topic_name)
    topic_arn = response['TopicArn']
    sns_client.subscribe(TopicArn=topic_arn, Protocol='email', Endpoint=user_email)

    # Send the email using SNS
    sns_client.publish(TopicArn=topic_arn, Message=message)
