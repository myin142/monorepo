import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';

export class AppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const japaneseApi = new RestApi(this, 'japaneseApi', {});

        const createKanjiReport = new NodejsFunction(this, 'createKanjiReport', {
            entry: '../../libs/lambda/kanji-report/src/app.ts',
            handler: 'createKanjiReport',
            nodeModules: ['lodash'],
        });

        const kanjiResource = japaneseApi.root.addResource('kanji');
        const kanjiReportResource = kanjiResource.addResource('report');
        kanjiReportResource.addMethod('POST', new LambdaIntegration(createKanjiReport));
    }
}
