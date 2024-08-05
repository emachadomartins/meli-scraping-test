import os
import boto3
import json
from botocore.config import Config

config = Config(
    region_name=os.getenv('AWS_REGION')
)

sqs = boto3.client('sqs', config=config)
s3 = boto3.client('s3', config=config)

queue_url = os.getenv('QUEUE_URL')
bucket = os.getenv('BUCKET_NAME')


def send_message(message):
    json_message = json.dumps(message)
    return sqs.send_message(
        QueueUrl=queue_url,
        DelaySeconds=10,
        MessageBody=json_message
    )


def get_object(path: str):
    try:
        object = s3.get_object(
            Bucket=bucket,
            Key=path
        )['Body'].read()
        return object
    except:
        return None


def put_object(object: str, path: str):
    s3.put_object(
        Bucket=bucket,
        Key=path,
        Body=object
    )
    return object
