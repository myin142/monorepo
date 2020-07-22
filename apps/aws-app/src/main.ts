import * as cdk from '@aws-cdk/core';
import { AppStack } from '../../../libs/japanese/cloud/src/app-stack';

const app = new cdk.App();
new AppStack(app, 'aws-app');
