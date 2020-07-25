import { App } from '@aws-cdk/core';
import { MainStack } from './main-stack';

const app = new App();
new MainStack(app, 'main');
