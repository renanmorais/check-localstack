import {GetCommand, PutCommand} from '@aws-sdk/lib-dynamodb';
import {doc, TABLE_NAME} from '../../src/aws';


describe('Dynamo CRUD', () => {
    it('persists user profile', async () => {
        const pk = 'USER#itest';
        const sk = 'PROFILE';


        await doc.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: {pk, sk, foo: 'bar'}
        }));


        const got = await doc.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {pk, sk}
        }));


        expect(got.Item?.foo).toBe('bar');
    });
});
