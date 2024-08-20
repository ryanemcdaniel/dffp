import {Client} from 'clashofclans.js';
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';

export const coc = new Client();

const dynamo = new DynamoDBClient();
export const ddb = DynamoDBDocumentClient.from(dynamo);
