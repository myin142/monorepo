/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Construct } from '@aws-cdk/core';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Path } from '../../../libs/shared/utils/src';
import { kanjiAttributes, kanjiReport } from '../../../libs/japanese/interface/src';
import { defaultRestApi, AuthenticatedRestConstruct, defaultCognito } from './shared-stack';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';

const japanesePath = (path?: string): string => Path.join('../../dist/libs/japanese/cloud/', path);

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

        const getKanjiReports = new Function(this, 'getKanjiReports', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(japanesePath()),
            handler: 'japanese-cloud.getKanjiReports',
        });

        kanjiReportTable.grantReadData(getKanjiReports);

        const createKanjiReport = new Function(this, 'createKanjiReport', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(japanesePath()),
            handler: 'japanese-cloud.createKanjiReport',
        });

        kanjiReportTable.grantReadWriteData(createKanjiReport);
        kanjiAttributesTable.grantReadData(createKanjiReport);

        const getAllKanjiStats = new Function(this, 'getAllKanjisStats', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(japanesePath()),
            handler: 'japanese-cloud.getAllKanjiStats',
        });

        kanjiAttributesTable.grantReadData(getAllKanjiStats);

        const kanjiResource = japaneseApi.root.addResource('kanji');

        const kanjiReportResource = kanjiResource.addResource('report');
        kanjiReportResource.addMethod('POST', new LambdaIntegration(createKanjiReport), authOpt);
        kanjiReportResource.addMethod('GET', new LambdaIntegration(getKanjiReports), authOpt);

        const kanjiAttributeResource = japaneseApi.root.addResource('attributes');
        kanjiAttributeResource.addMethod('GET', new LambdaIntegration(getAllKanjiStats), authOpt);
    }
}
