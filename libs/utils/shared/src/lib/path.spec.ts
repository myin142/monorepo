import { Path } from './path';

describe('Path', () => {
    it('join single value', () => {
        expect(Path.join('/path/')).toEqual('/path/');
    });

    it('join multiple values', () => {
        expect(Path.join('path', 'sub', 'dir')).toEqual('path/sub/dir');
    });

    it('join with all slashes', () => {
        expect(Path.join('/path/', '/sub/')).toEqual('/path/sub/');
    });

    it('keep starting slash', () => {
        expect(Path.join('/path', 'sub')).toEqual('/path/sub');
    });

    it('keep ending slash', () => {
        expect(Path.join('path', 'sub/')).toEqual('path/sub/');
    });
});
