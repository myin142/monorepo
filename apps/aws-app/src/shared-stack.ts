import {
    RestApi,
    RestApiProps,
    AuthorizationType,
    CfnAuthorizer,
    MethodOptions,
} from '@aws-cdk/aws-apigateway';
import { Construct } from '@aws-cdk/core';
import { UserPool } from '@aws-cdk/aws-cognito';

export const defaultRestApi = (scope: Construct, id: string, props?: RestApiProps) => {
    const api = new RestApi(scope, id, {
        deployOptions: {
            throttlingBurstLimit: 10,
            throttlingRateLimit: 10,
        },
        defaultCorsPreflightOptions: {
            allowOrigins: ['*'],
            allowHeaders: ['Authorization'],
            allowCredentials: true,
        },
        ...props,
    });

    return api;
};

// Waiting https://github.com/aws/aws-cdk/issues/5618
export const defaultCognito = (api: RestApi, userPool: UserPool): MethodOptions => {
    const authorizer = new CfnAuthorizer(api.stack, 'authorizer', {
        restApiId: api.restApiId,
        type: AuthorizationType.COGNITO,
        name: 'MainPoolAuthorizer',
        identitySource: 'method.request.header.Authorization',
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
