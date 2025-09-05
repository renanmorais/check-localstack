import {PutEventsCommand} from '@aws-sdk/client-eventbridge';
import {GetCommand} from '@aws-sdk/lib-dynamodb';
import {doc, events, TABLE_NAME} from '../../src/aws';

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

describe('Complete Integration Flow', () => {
    it('processes EventBridge event through Lambda to DynamoDB', async () => {
        const userId = `flow-test-${Date.now()}`;
        const email = 'flowtest@example.com';

        // 1. Enviar evento para EventBridge
        const putResult = await events.send(new PutEventsCommand({
            Entries: [{
                Source: 'app.example',
                DetailType: 'user.created',
                Detail: JSON.stringify({userId, email}),
                EventBusName: process.env.EVENT_BUS_NAME || 'app-bus'
            }]
        }));

        expect(putResult.FailedEntryCount).toBe(0);

        // 2. Aguardar processamento (EventBridge -> Lambda -> DynamoDB)
        await wait(3000);

        // 3. Verificar se o dado foi salvo no DynamoDB
        const result = await doc.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                pk: `USER#${userId}`,
                sk: 'PROFILE'
            }
        }));

        expect(result.Item).toBeDefined();
        expect(result.Item?.email).toBe(email);
        expect(result.Item?.createdAt).toBeDefined();
    }, 10000);
});
