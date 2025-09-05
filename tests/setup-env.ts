process.env.IS_LOCAL = 'true';
process.env.AWS_REGION = process.env.AWS_REGION || 'us-east-1';
process.env.TABLE_NAME = process.env.TABLE_NAME || 'documentParser';
process.env.QUEUE_NAME = process.env.QUEUE_NAME || 'app-queue';
process.env.TOPIC_NAME = process.env.TOPIC_NAME || 'app-topic';
process.env.EVENT_BUS_NAME = process.env.EVENT_BUS_NAME || 'localstack-skeleton-local-bus';
