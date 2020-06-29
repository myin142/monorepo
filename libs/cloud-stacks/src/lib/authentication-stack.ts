import * as cdk from '@aws-cdk/core';
import { UserPool, UserPoolClientIdentityProvider, OAuthScope } from '@aws-cdk/aws-cognito';

export class AuthenticationStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const userPoolName = 'MyinUserPool';
        const userPoolClientName = `${userPoolName}Client`;
        const userPoolDomainName = `${userPoolName}Domain`;
        const userPoolDomainPrefix = 'myin-user-domain';

        const userPool = new UserPool(this, 'userpool', { userPoolName });

        const client = userPool.addClient(userPoolClientName, {
            supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
            oAuth: {
                flows: { implicitCodeGrant: true },
                scopes: [
                    OAuthScope.EMAIL,
                    OAuthScope.OPENID,
                    OAuthScope.PROFILE,
                ],
                callbackUrls: [
                    'http://localhost:8080/login/oauth2',
                    'http://localhost:4200/login/oauth2',
                    'http://localhost:4300/login/oauth2',
                ],
            },
        });

        const domain = userPool.addDomain(userPoolDomainName, {
            cognitoDomain: { domainPrefix: userPoolDomainPrefix },
        });
    }
}
