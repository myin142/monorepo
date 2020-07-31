import { isKanji, extractKanjis } from '../lib/utils-japanese';

describe('Utils Japanese', () => {
    describe('Is Kanji', () => {
        it('return true if kanji', () => {
            expect(isKanji('日')).toBeTruthy();
        });

        it('return false if null', () => {
            expect(isKanji(null)).toBeFalsy();
        });

        it('return false if hiragana', () => {
            expect(isKanji('あ')).toBeFalsy();
        });

        it('return false if katakana', () => {
            expect(isKanji('ア')).toBeFalsy();
        });

        it('return false if not kanji', () => {
            expect(isKanji('a')).toBeFalsy();
        });
    });

    describe('Extract Kanjis', () => {
        it('extract all kanjis', () => {
            expect(extractKanjis('私は日本語を学んでいますー。')).toEqual([
                '私',
                '日',
                '本',
                '語',
                '学',
            ]);
        });

        it('extract unique kanjis', () => {
            expect(extractKanjis('私私私私')).toEqual(['私']);
        });

        it('empty array on null', () => {
            expect(extractKanjis(null)).toEqual([]);
        });
    });
});
