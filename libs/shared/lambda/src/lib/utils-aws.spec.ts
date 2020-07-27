import { toAWSAttributeMap } from '../index';
import { fromAWSAttributeMap, toAWSAttributeMapArray, fromAWSAttributeMapArray } from './utils-aws';

describe('Utils AWS', () => {
    describe('To AWS AttributeMap', () => {
        it('skip null', () => {
            expect(toAWSAttributeMap({ text: null })).toEqual({});
        });

        it('skip invalid type', () => {
            expect(toAWSAttributeMap({ text: {} })).toEqual({});
        });

        it('map string', () => {
            expect(toAWSAttributeMap({ text: 'Text' })).toEqual({
                text: { S: 'Text' },
            });
        });

        it('map number', () => {
            expect(toAWSAttributeMap({ num: 1 })).toEqual({
                num: { N: '1' },
            });
        });
    });

    describe('From AWS AttributeMap', () => {
        it('skip null', () => {
            expect(fromAWSAttributeMap({ text: null })).toEqual({});
        });

        it('skip empty', () => {
            expect(fromAWSAttributeMap({ text: {} })).toEqual({});
        });

        it('map string', () => {
            expect(fromAWSAttributeMap({ text: { S: 'Text' } })).toEqual({
                text: 'Text',
            });
        });

        it('map number', () => {
            expect(fromAWSAttributeMap({ num: { N: '1' } })).toEqual({
                num: 1,
            });
        });
    });

    it('map array to AWS AttributeMap', () => {
        expect(toAWSAttributeMapArray([{ text: 'Text', num: 1 }])).toEqual([
            {
                text: { S: 'Text' },
                num: { N: '1' },
            },
        ]);
    });

    it('map array from AWS AttributeMap', () => {
        expect(fromAWSAttributeMapArray([{ text: { S: 'Text' }, num: { N: '1' } }])).toEqual([
            {
                text: 'Text',
                num: 1,
            },
        ]);
    });
});
