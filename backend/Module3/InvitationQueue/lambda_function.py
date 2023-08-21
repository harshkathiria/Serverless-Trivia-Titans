import json
import boto3

sqs_client = boto3.client('sqs')

def lambda_handler(event, context):
    t_id = event['t_id']
    emails_list = event['emails']

    # Iterate through the list of emails and send individual messages to SQS
    for email in emails_list:
        # Prepare the message containing team name and email
        message = {
            't_id': t_id,
            'user_email': email
        }

        # Send the message to the SQS queue
        queue_url = 'https://sqs.us-east-1.amazonaws.com/040642117953/InvitationQueue'
        print()
        sqs_client.send_message(QueueUrl=queue_url, MessageBody=json.dumps(message))

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
        'body':json.dumps({'message': "Success"})
    }
