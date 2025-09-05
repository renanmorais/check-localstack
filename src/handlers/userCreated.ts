import {PutCommand} from '@aws-sdk/lib-dynamodb';
import {doc, TABLE_NAME} from '../aws';
import type {UserCreatedDetail} from '../types';


export const handler = async (event: any) => {
    const records = Array.isArray(event.Records) ? event.Records : [];


// Suporta invocação via EventBridge (payload direto) e via Rule->Lambda (Records)
    const entries: UserCreatedDetail[] = records.length
        ? records.map((r: any) => JSON.parse(r.body || r.detail || '{}'))
        : [JSON.parse(event.detail || '{}')];


    for (const detail of entries) {
        if (!detail?.userId) continue;
        await doc.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                pk: `USER#${detail.userId}`,
                sk: 'PROFILE',
                email: detail.email || null,
                createdAt: new Date().toISOString()
            }
        }));
    }


    return {statusCode: 200};
};
