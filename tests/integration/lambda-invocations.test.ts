import {InvokeCommand, LambdaClient, ListFunctionsCommand} from '@aws-sdk/client-lambda';

const lambda = new LambdaClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:4566'
});

describe('Lambda Invocations (Fixed)', () => {
    let httpPingFunctionName: string;

    beforeAll(async () => {
        // Descobrir o nome exato da função
        const functions = await lambda.send(new ListFunctionsCommand({}));
        const httpPingFunction = functions.Functions?.find(fn =>
            fn.FunctionName?.includes('httpPing')
        );

        if (!httpPingFunction?.FunctionName) {
            throw new Error('HttpPing function not found. Available functions: ' +
                functions.Functions?.map(f => f.FunctionName).join(', '));
        }

        httpPingFunctionName = httpPingFunction.FunctionName;
        console.log('Using function name:', httpPingFunctionName);
    });

    it('invokes httpPing function with minimal payload', async () => {
        try {
            const result = await lambda.send(new InvokeCommand({
                FunctionName: httpPingFunctionName,
                InvocationType: 'RequestResponse',
                Payload: JSON.stringify({})
            }));

            console.log('Lambda invoke result:', {
                StatusCode: result.StatusCode,
                FunctionError: result.FunctionError,
                LogResult: result.LogResult ? Buffer.from(result.LogResult, 'base64').toString() : 'No logs'
            });

            expect(result.StatusCode).toBe(200);
            expect(result.FunctionError).toBeUndefined();

            if (result.Payload) {
                const payload = JSON.parse(new TextDecoder().decode(result.Payload));
                console.log('Function response:', payload);

                expect(payload.statusCode).toBe(200);
                const body = JSON.parse(payload.body);
                expect(body.ok).toBe(true);
            }
        } catch (error) {
            console.error('Lambda invocation failed:', error);
            throw error;
        }
    });

    it('invokes httpPing with API Gateway event structure', async () => {
        const apiGatewayEvent = {
            httpMethod: 'GET',
            path: '/ping',
            headers: {
                'Content-Type': 'application/json'
            },
            multiValueHeaders: {},
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            body: null,
            isBase64Encoded: false,
            pathParameters: null,
            stageVariables: null,
            requestContext: {
                requestId: 'test-request-id',
                stage: 'local',
                resourcePath: '/ping',
                httpMethod: 'GET',
                requestTimeEpoch: Date.now(),
                protocol: 'HTTP/1.1',
                resourceId: 'test-resource-id',
                accountId: '000000000000',
                apiId: 'test-api-id',
                identity: {
                    sourceIp: '127.0.0.1'
                }
            },
            resource: '/ping'
        };

        try {
            const result = await lambda.send(new InvokeCommand({
                FunctionName: httpPingFunctionName,
                InvocationType: 'RequestResponse',
                Payload: JSON.stringify(apiGatewayEvent)
            }));

            expect(result.StatusCode).toBe(200);
            expect(result.FunctionError).toBeUndefined();

            if (result.Payload) {
                const payload = JSON.parse(new TextDecoder().decode(result.Payload));
                expect(payload.statusCode).toBe(200);

                const body = JSON.parse(payload.body);
                expect(body.ok).toBe(true);
                expect(body.ts).toBeDefined();
                expect(body.message).toBe('Ping successful');
            }
        } catch (error) {
            console.error('API Gateway event invocation failed:', error);
            throw error;
        }
    });
});
