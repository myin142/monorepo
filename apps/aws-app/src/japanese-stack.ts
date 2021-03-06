/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Construct } from '@aws-cdk/core';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Path } from '../../../libs/shared/utils/src';
import { kanjiAttributes, kanjiRadicals, kanjiReport } from '../../../libs/japanese/interface/src';
import { defaultRestApi, AuthenticatedRestConstruct, defaultCognito } from './shared-stack';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { } from '@aws-cdk/aws-ssm';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';

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

        const kanjiRadicalTable = new Table(this, kanjiRadicals.table, {
            tableName: kanjiRadicals.table,
            partitionKey: {
                name: kanjiRadicals.key,
                type: AttributeType.STRING,
            },
            sortKey: {
                name: kanjiRadicals.sort,
                type: AttributeType.STRING,
            },
        });

        const getKanjisForRadical = new Function(this, 'getKanjisForRadical', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(japanesePath()),
            handler: 'japanese-cloud.getKanjisForRadical',
        });

        kanjiRadicalTable.grantReadData(getKanjisForRadical);

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

        const kanjiAttributeResource = kanjiResource.addResource('attributes');
        kanjiAttributeResource.addMethod('GET', new LambdaIntegration(getAllKanjiStats), authOpt);

        const ssmMongoDBRead = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['ssm:GetParameter'],
            resources: ['arn:aws:ssm:eu-central-1:841152197398:parameter/mongodb_*'],
        });

        const updateRadical = new Function(this, 'updateRadical', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(japanesePath()),
            handler: 'japanese-cloud.updateRadical',
        });
        updateRadical.addToRolePolicy(ssmMongoDBRead);

        const getRadicals = new Function(this, 'getRadicals', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(japanesePath()),
            handler: 'japanese-cloud.getRadicals',
        });
        getRadicals.addToRolePolicy(ssmMongoDBRead);

        const radicalResource = japaneseApi.root.addResource('radical');
        radicalResource.addMethod('POST', new LambdaIntegration(updateRadical), authOpt);
        radicalResource.addMethod('GET', new LambdaIntegration(getRadicals));

        const radicalKanjiResource = radicalResource.addResource('kanjis');
        radicalKanjiResource.addMethod('GET', new LambdaIntegration(getKanjisForRadical));
    }
}
