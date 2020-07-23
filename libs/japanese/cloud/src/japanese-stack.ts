import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Path } from '../../../shared/utils/src';
import { kanjiAttributes } from '@myin/japanese/interface';
import { defaultRestApi } from '@myin/shared/aws';

const japanesePath = (path?: string): string =>
    Path.join('../../libs/japanese/cloud/src/lib', path);

export class JapaneseStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const japaneseApi = defaultRestApi(this, 'japaneseApi');

        const kanjiAttributesTable = new Table(this, kanjiAttributes.table, {
            tableName: kanjiAttributes.table,
            partitionKey: {
                name: kanjiAttributes.key,
                type: AttributeType.STRING,
            },
            writeCapacity: 1,
        });

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

        kanjiAttributesTable.grantReadData(createKanjiReport);
        kanjiAttributesTable.grantReadData(getAllKanjiStats);

        const kanjiResource = japaneseApi.root.addResource('kanji');
        const kanjiReportResource = kanjiResource.addResource('report');
        kanjiReportResource.addMethod('POST', new LambdaIntegration(createKanjiReport));
        kanjiReportResource.addMethod('GET', new LambdaIntegration(getAllKanjiStats));
    }
}
