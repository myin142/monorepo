import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Path } from '../../../shared/utils/src';

const japanesePath = (path?: string): string =>
    Path.join('../../libs/japanese/cloud/src/lib', path);

export class AppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const japaneseApi = new RestApi(this, 'japaneseApi', {});

        const createKanjiReport = new NodejsFunction(this, 'createKanjiReport', {
            entry: japanesePath('kanji-report.ts'),
            handler: 'createKanjiReport',
            nodeModules: ['lodash'],
        });

        const getAllKanjiStats = new NodejsFunction(this, 'getAllKanjiStats', {
            entry: japanesePath('kanji-report.ts'),
            handler: 'getAllKanjiStats',
            nodeModules: ['lodash'],
        });

        const kanjiResource = japaneseApi.root.addResource('kanji');
        const kanjiReportResource = kanjiResource.addResource('report');
        kanjiReportResource.addMethod('POST', new LambdaIntegration(createKanjiReport));
        kanjiReportResource.addMethod('GET', new LambdaIntegration(getAllKanjiStats));
    }
}
