/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Construct } from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Path } from '../../../shared/utils/src';
import { kanjiAttributes, kanjiReport } from '../../interface/src';
import {
    defaultRestApi,
    AuthenticatedRestConstruct,
    defaultCognito,
} from '../../../shared/aws/src';

const japanesePath = (path?: string): string =>
    Path.join('../../libs/japanese/cloud/src/lib', path);

export class JapaneseStack extends Construct {
    constructor(scope: Construct, id: string, props?: AuthenticatedRestConstruct) {
        super(scope, id);

        const japaneseApi = defaultRestApi(this, 'japaneseApi');
        const authOpt = defaultCognito(japaneseApi, props.userPool);

        const kanjiAttributesTable = new Table(this, kanjiAttributes.table, {
            tableName: kanjiAttributes.table,
            partitionKey: {
                name: kanjiAttributes.key,
                type: AttributeType.STRING,
            },
            writeCapacity: 1,
        });

        const kanjiReportTable = new Table(this, kanjiReport.table, {
            tableName: kanjiReport.table,
            partitionKey: {
                name: kanjiReport.key,
                type: AttributeType.STRING,
            },
            sortKey: {
                name: kanjiReport.sort,
                type: AttributeType.NUMBER,
            },
        });

        const createKanjiReport = new NodejsFunction(this, 'createKanjiReport', {
            entry: japanesePath('kanji-report.ts'),
            handler: 'createKanjiReport',
            nodeModules: ['lodash'],
        });
        kanjiReportTable.grantReadWriteData(createKanjiReport);
        kanjiAttributesTable.grantReadData(createKanjiReport);

        const getAllKanjiStats = new NodejsFunction(this, 'getAllKanjiStats', {
            entry: japanesePath('kanji-report.ts'),
            handler: 'getAllKanjiStats',
            nodeModules: ['lodash'],
        });

        kanjiAttributesTable.grantReadData(getAllKanjiStats);

        const kanjiResource = japaneseApi.root.addResource('kanji');
        const kanjiReportResource = kanjiResource.addResource('report');
        kanjiReportResource.addMethod('POST', new LambdaIntegration(createKanjiReport), authOpt);
        kanjiReportResource.addMethod('GET', new LambdaIntegration(getAllKanjiStats), authOpt);
    }
}
