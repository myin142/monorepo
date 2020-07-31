import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { JapaneseStack } from './japanese-stack';
import { AuthStack } from './auth-stack';

// Yaml output does not work with dependent multi-stack
// https://github.com/aws/aws-cdk/issues/3721
export class MainStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const auth = new AuthStack(this, 'auth');
        new JapaneseStack(this, 'japanese', { userPool: auth.userPool });
    }
}
