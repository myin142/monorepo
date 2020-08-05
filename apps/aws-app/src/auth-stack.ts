import { Construct, StackProps } from '@aws-cdk/core';
import { UserPool, UserPoolClientIdentityProvider, OAuthScope } from '@aws-cdk/aws-cognito';
import { USERPOOL_DOMAIN } from '../../../libs/shared/interface/src';

export class AuthStack extends Construct {
    userPool: UserPool;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id);

        const userPoolName = 'MyinUserPool';
        const userPoolClientName = `${userPoolName}Client`;
        const userPoolDomainName = `${userPoolName}Domain`;
        const userPoolDomainPrefix = USERPOOL_DOMAIN;

        this.userPool = new UserPool(this, 'userpool', { userPoolName });

        this.userPool.addClient(userPoolClientName, {
            supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
            oAuth: {
                flows: { implicitCodeGrant: true },
                scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
                callbackUrls: [
                    'http://localhost:8080/login',
                    'http://localhost:4200/login',
                    'http://localhost:4300/login',
                    'https://myin142.github.io/japanese/login',
                    'https://myin142.github.io/admin/login',
                ],
            },
        });

        this.userPool.addDomain(userPoolDomainName, {
            cognitoDomain: { domainPrefix: userPoolDomainPrefix },
        });
    }
}
