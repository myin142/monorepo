import { RestApi, RestApiProps, AuthorizationType } from '@aws-cdk/aws-apigateway';
import { Construct } from '@aws-cdk/core';

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
