export function statusAndBody(statusCode, body): ApiGatewayResponse {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
        },
        body: JSON.stringify(body),
    };
}

export function successAndBody(body = {}): ApiGatewayResponse {
    return statusAndBody(200, body);
}

export function statusAndError(statusCode, error): ApiGatewayResponse {
    return statusAndBody(statusCode, { error });
}

export interface ApiGatewayResponse {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
}
