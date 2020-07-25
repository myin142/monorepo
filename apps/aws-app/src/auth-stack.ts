import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { UserPool, UserPoolClientIdentityProvider, OAuthScope } from '@aws-cdk/aws-cognito';
import { USERPOOL_DOMAIN } from '@myin/shared/interface';

export class AuthStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const userPoolName = 'MyinUserPool';
        const userPoolClientName = `${userPoolName}Client`;
        const userPoolDomainName = `${userPoolName}Domain`;
        const userPoolDomainPrefix = USERPOOL_DOMAIN;

        const userPool = new UserPool(this, 'userpool', { userPoolName });

        userPool.addClient(userPoolClientName, {
            supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
            oAuth: {
                flows: { implicitCodeGrant: true },
                scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
                callbackUrls: [
                    'http://localhost:8080/login',
                    'http://localhost:4200/login',
                    'http://localhost:4300/login',
                ],
            },
        });

        userPool.addDomain(userPoolDomainName, {
            cognitoDomain: { domainPrefix: userPoolDomainPrefix },
        });
    }
}
