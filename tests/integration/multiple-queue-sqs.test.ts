import {
    GetQueueAttributesCommand,
    GetQueueUrlCommand,
    PurgeQueueCommand,
    ReceiveMessageCommand,
    SendMessageCommand
} from '@aws-sdk/client-sqs';
import {QUEUE_NAME, sqs} from '../../src/aws';

describe('SQS Operations', () => {
    let queueUrl: string;

    beforeAll(async () => {
        const urlResult = await sqs.send(new GetQueueUrlCommand({
            QueueName: QUEUE_NAME
        }));
        queueUrl = urlResult.QueueUrl!;
    });

    beforeEach(async () => {
        // Limpar a fila antes de cada teste
        await sqs.send(new PurgeQueueCommand({QueueUrl: queueUrl}));
    });

    it('sends and receives messages', async () => {
        const messageBody = JSON.stringify({
            userId: 'sqs-test-user',
            action: 'test-action',
            timestamp: new Date().toISOString()
        });

        // Enviar mensagem
        const sendResult = await sqs.send(new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: messageBody
        }));

        expect(sendResult.MessageId).toBeDefined();

        // Receber mensagem
        const receiveResult = await sqs.send(new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 2
        }));

        expect(receiveResult.Messages).toBeDefined();
        expect(receiveResult.Messages!.length).toBe(1);
        expect(receiveResult.Messages![0].Body).toBe(messageBody);
    });

    it('checks queue attributes', async () => {
        const attributes = await sqs.send(new GetQueueAttributesCommand({
            QueueUrl: queueUrl,
            AttributeNames: ['All']
        }));

        expect(attributes.Attributes?.QueueArn).toBeDefined();
        expect(attributes.Attributes?.ApproximateNumberOfMessages).toBeDefined();
    });
});
