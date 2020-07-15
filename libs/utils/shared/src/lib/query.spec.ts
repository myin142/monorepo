import { Query } from './query';

describe('Query', () => {
    it('create single query param', () => {
        expect(Query.create({ param: 'Value' })).toEqual('param=Value');
    });

    it('create multiple query param', () => {
        expect(
            Query.create({
                param1: 'Value1',
                param2: 'Value2',
            })
        ).toEqual('param1=Value1&param2=Value2');
    });

    it('create empty if undefined', () => {
        expect(Query.create(null)).toEqual('');
    });

    it('create empty if empty object', () => {
        expect(Query.create({})).toEqual('');
    });
});
