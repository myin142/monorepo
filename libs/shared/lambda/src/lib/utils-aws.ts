import {} from 'aws-sdk';
import { AttributeMap, AttributeValue } from 'aws-sdk/clients/dynamodb';

class AWSAttributeMapAdapter {
    static toAttributeValue(value: any): AttributeValue {
        let key = null;
        switch (typeof value) {
            case 'string':
                key = 'S';
                break;
            case 'number':
                key = 'N';
                break;
        }

        return key ? { [key]: `${value}` } : null;
    }

    static fromAttributeValue(value: AttributeValue): any {
        if (value == null) return null;

        const type = Object.keys(value)[0];
        switch (type) {
            case 'S':
                return value[type];
            case 'N':
                return parseInt(value[type]);
        }
    }
}

export const toAWSAttributeMap = <T>(obj: T): AttributeMap => {
    if (obj == null) return null;

    const attributeMap = {};

    Object.keys(obj).forEach((key) => {
        const value = AWSAttributeMapAdapter.toAttributeValue(obj[key]);
        if (value) {
            attributeMap[key] = value;
        }
    });

    return attributeMap;
};

export const toAWSAttributeMapArray = (arr: Array<object>): AttributeMap[] => {
    return arr.map(toAWSAttributeMap);
};

export const fromAWSAttributeMap = <T>(attributeMap: AttributeMap): T => {
    const result = {};

    Object.keys(attributeMap).forEach((key) => {
        const value = AWSAttributeMapAdapter.fromAttributeValue(attributeMap[key]);
        if (value) {
            result[key] = value;
        }
    });

    return result as T;
};

export const fromAWSAttributeMapArray = <T>(arr: Array<AttributeMap>): T[] => {
    return arr.map<T>(fromAWSAttributeMap);
};
