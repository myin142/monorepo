import { RestApi, RestApiProps, AuthorizationType, CfnAuthorizer } from '@aws-cdk/aws-apigateway';
import { Construct } from '@aws-cdk/core';
import { UserPool } from '@aws-cdk/aws-cognito';

export const defaultRestApi = (scope: Construct, id: string, props?: RestApiProps) => {
    const api = new RestApi(scope, id, {
        defaultMethodOptions: {
            // Waiting https://github.com/aws/aws-cdk/issues/5618
            authorizationType: AuthorizationType.COGNITO,
        },
        ...props,
    });

    api.addUsagePlan('throttle', {
        throttle: { burstLimit: 10, rateLimit: 10 },
    });

    return api;
};

export const defaultCognito = (api: RestApi, userPool: UserPool) => {
    const authorizer = new CfnAuthorizer(api.stack, 'authorizer', {
        restApiId: api.restApiId,
        type: AuthorizationType.COGNITO,
        name: 'MainPoolAuthorizer',
        identitySource: 'method.request.header.Authorization',
        identityValidationExpression: 'Bearer (.*)',
        providerArns: [userPool.userPoolArn],
    });

    return {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: { authorizerId: authorizer.ref },
    };
};

export interface AuthenticatedRestConstruct {
    userPool: UserPool;
}
