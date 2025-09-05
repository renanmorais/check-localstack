import {PutEventsCommand} from '@aws-sdk/client-eventbridge';
import {GetQueueUrlCommand, ReceiveMessageCommand} from '@aws-sdk/client-sqs';
import {events, sqs} from '../../src/aws';


const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));


describe('EventBridge -> SQS route', () => {
    it('routes user.created to SQS without failures', async () => {
        const put = await events.send(new PutEventsCommand({
            Entries: [{
                Source: 'app.example',
                DetailType: 'user.created',
                Detail: JSON.stringify({userId: 'u-xyz'}),
                EventBusName: process.env.EVENT_BUS_NAME || 'app-bus'
            }]
        }));


        expect(put.FailedEntryCount).toBe(0);


// aguarda pequena latência de roteamento
        await wait(1000);


        const qUrl = await sqs.send(new GetQueueUrlCommand({
            QueueName: process.env.QUEUE_NAME || 'app-queue'
        }));


        const rec = await sqs.send(new ReceiveMessageCommand({
            QueueUrl: qUrl.QueueUrl!,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 1
        }));


        expect(rec.Messages?.length || 0).toBeGreaterThan(0);
    }, 15000);
});
