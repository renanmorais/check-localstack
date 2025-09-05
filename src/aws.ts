import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SNSClient } from '@aws-sdk/client-sns';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';


const isLocal = process.env.IS_LOCAL === 'true';
const endpoint = isLocal ? 'http://localhost:4566' : undefined;
const region = process.env.AWS_REGION || 'us-east-1';


export const ddb = new DynamoDBClient({ region, endpoint });
export const doc = DynamoDBDocumentClient.from(ddb);
export const sqs = new SQSClient({ region, endpoint });
export const sns = new SNSClient({ region, endpoint });
export const events = new EventBridgeClient({ region, endpoint });


export const TABLE_NAME = process.env.TABLE_NAME || 'documentParser';
export const QUEUE_NAME = process.env.QUEUE_NAME || 'app-queue';
export const TOPIC_NAME = process.env.TOPIC_NAME || 'app-topic';
export const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME || 'app-bus';
