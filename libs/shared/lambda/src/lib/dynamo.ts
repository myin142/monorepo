import { DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { chunk } from 'lodash';
import { fromAWSAttributeMapArray } from './utils-aws';

const options = { region: 'eu-central-1' };
if (process.env.AWS_SAM_LOCAL) {
    options['endpoint'] = 'http://localhost:8000';
}
export const dynamo = new DynamoDB(options);

export const batchGet = <T>(table: string, keys: AttributeMap[]): Promise<T[]> => {
    return Promise.all(
        chunk(keys, 100).map(async (chunk) => {
            const response = await dynamo
                .batchGetItem({
                    RequestItems: {
                        [table]: { Keys: chunk },
                    },
                })
                .promise();

            return response.Responses[table];
        })
    )
        .then((items) => items.reduce((prev, curr) => prev.concat(curr), []))
        .then((items) => fromAWSAttributeMapArray<T>(items));
};
