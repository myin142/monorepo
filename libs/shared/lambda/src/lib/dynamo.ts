import { DynamoDB } from 'aws-sdk';
import { chunk } from 'lodash';
import { fromAWSAttributeMapArray, toAWSAttributeMapArray } from './utils-aws';

const options = { region: 'eu-central-1' };
if (process.env.AWS_SAM_LOCAL) {
    options['endpoint'] = 'http://localhost:8000';
}
export const dynamo = new DynamoDB(options);

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
