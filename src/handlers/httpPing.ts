import type {APIGatewayProxyHandler, APIGatewayProxyHandlerV2} from 'aws-lambda';

// Handler compatível com ambos os formatos (v1 e v2)
export const handler: APIGatewayProxyHandler | APIGatewayProxyHandlerV2 = async (event: any) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({
            ok: true,
            ts: Date.now(),
            message: 'Ping successful',
            isLocal: process.env.IS_LOCAL === 'true'
        })
    };

    console.log('Returning response:', JSON.stringify(response, null, 2));
    return response;
};
