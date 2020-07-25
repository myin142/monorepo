import { App } from '@aws-cdk/core';
import { JapaneseStack } from '../../../libs/japanese/cloud/src/japanese-stack';
import { AuthStack } from './auth-stack';

const app = new App();
new AuthStack(app, 'auth');
new JapaneseStack(app, 'japanese');
