export const kanjiAttributes = {
    table: 'KanjiAttributes',
    key: 'kanji',
};

export interface KanjiAttribute {
    kanji: string;
    jlpt: number;
    grade: number;
}

export const kanjiReport = {
    table: 'KanjiReports',
    key: 'user',
    sort: 'created',
};

export const kanjiRadicals = {
    table: 'KanjiRadicals',
    key: 'radical',
    sort: 'kanji',
};
