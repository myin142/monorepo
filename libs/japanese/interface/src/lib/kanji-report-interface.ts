export interface KanjiReportCounts {
    total: number;
    grades: { [k: number]: number };
    jlpt: { [k: number]: number };
}

export interface AllKanjiStats {
    total: number;
    grades: { [k: number]: number };
    jlpt: { [k: number]: number };
    frequencyMax: number;
}
