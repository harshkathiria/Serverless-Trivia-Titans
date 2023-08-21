import boto3
import json
import openai
import uuid

dynamodb = boto3.resource('dynamodb')
table_name = 'TeamDetails'

def generate_team_name(u_id):
    # Use OpenAI to generate a team name based on the user's u_id
    openai.api_key = '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'

    prompt = f"give just the name of a group"
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=30,
        n=1,
        stop=None,
        temperature=0.7,
    )

    team_name = response['choices'][0]['text'].strip()
    return team_name

def lambda_handler(event, context):
    u_id = event['u_email']

    # Generate a team name based on the user's u_id using OpenAI
    team_name = generate_team_name(u_id)

    # Generate t_id
    t_id = str(uuid.uuid4())

    # Add the new team document to the Teams table in DynamoDB
    dynamodb_table = dynamodb.Table(table_name)
    dynamodb_table.put_item(
        Item={
            't_id': t_id,
            't_name': team_name,
            'members': [u_id],
            'admin': u_id,
        }
    )

    # Return the generated t_id
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps({'t_id': t_id})
    }
