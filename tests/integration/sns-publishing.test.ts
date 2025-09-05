import {GetTopicAttributesCommand, PublishCommand} from '@aws-sdk/client-sns';
import {sns, TOPIC_NAME} from '../../src/aws';

describe('SNS Publishing', () => {
    it('publishes message to topic successfully', async () => {
        // Primeiro, obter o ARN do tópico
        const topicArn = `arn:aws:sns:us-east-1:000000000000:${TOPIC_NAME}`;

        const publishResult = await sns.send(new PublishCommand({
            TopicArn: topicArn,
            Message: JSON.stringify({
                userId: 'test-user-123',
                action: 'user-updated',
                timestamp: new Date().toISOString()
            }),
            Subject: 'User Updated Notification'
        }));

        expect(publishResult.MessageId).toBeDefined();
        expect(publishResult.$metadata.httpStatusCode).toBe(200);
    });

    it('verifies topic attributes', async () => {
        const topicArn = `arn:aws:sns:us-east-1:000000000000:${TOPIC_NAME}`;

        const attributes = await sns.send(new GetTopicAttributesCommand({
            TopicArn: topicArn
        }));

        expect(attributes.Attributes?.TopicArn).toBe(topicArn);
        expect(attributes.Attributes?.DisplayName).toBeDefined();
    });
});
