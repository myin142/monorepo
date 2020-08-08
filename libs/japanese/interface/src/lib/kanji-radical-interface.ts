export interface KanjiRadicalResponse {
    radical: string;
    kanji: string;
    otherRadicals: string[];
}

export interface KanjiRadical {
    radical: string;
    kanjis: KanjiRadicalResponse[];
}