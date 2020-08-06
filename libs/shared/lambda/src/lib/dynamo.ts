import { DynamoDB } from 'aws-sdk';
import { ExpressionAttributeValueMap } from 'aws-sdk/clients/dynamodb';
import { chunk } from 'lodash';
import { fromAWSAttributeMapArray, toAWSAttributeMap, toAWSAttributeMapArray } from './utils-aws';

const options = { region: 'eu-central-1' };
if (process.env.AWS_SAM_LOCAL) {
    options['endpoint'] = 'http://localhost:8000';
}
export const dynamo = new DynamoDB(options);

export class DynamoWrapper {
    constructor(private dynamo: DynamoDB = dynamo) {}

    async batchGet<T>(table: string, keys: object[]): Promise<T[]> {
        return Promise.all(
            chunk(keys, 100).map(async (chunk) => {
                const response = await this.dynamo
                    .batchGetItem({
                        RequestItems: {
                            [table]: { Keys: toAWSAttributeMapArray(chunk) },
                        },
                    })
                    .promise();

                return response.Responses[table];
            })
        )
            .then((items) => items.reduce((prev, curr) => prev.concat(curr), []))
            .then((items) => fromAWSAttributeMapArray<T>(items));
    }

    async query<T>(table: string, condition: string, values: object): Promise<T[]> {
        const expressionValues: ExpressionAttributeValueMap = toAWSAttributeMapArray(
            Object.keys(values)
                .map((k) => (!k.startsWith(':') ? `:${k}` : k))
                .map((k) => ({ [k]: values[k] }))
        );

        const response = await this.dynamo
            .query({
                TableName: table,
                KeyConditionExpression: condition,
                ExpressionAttributeValues: expressionValues,
            })
            .promise();

        response.Items;
    }
}

export const batchGet = <T>(table: string, keys: object[]): Promise<T[]> => {
    return Promise.all(
        chunk(keys, 100).map(async (chunk) => {
            const response = await dynamo
                .batchGetItem({
                    RequestItems: {
                        [table]: { Keys: toAWSAttributeMapArray(chunk) },
                    },
                })
                .promise();

            return response.Responses[table];
        })
    )
        .then((items) => items.reduce((prev, curr) => prev.concat(curr), []))
        .then((items) => fromAWSAttributeMapArray<T>(items));
};
