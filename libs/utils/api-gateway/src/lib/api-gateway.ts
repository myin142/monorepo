export function statusAndBody(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
        },
        body: JSON.stringify(body),
    };
}

export function successAndBody(body) {
    return statusAndBody(200, body);
}

export function statusAndError(statusCode, error) {
    return statusAndBody(statusCode, { error });
}
