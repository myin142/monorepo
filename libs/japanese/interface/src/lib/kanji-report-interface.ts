export interface KanjiReportCounts {
    total: number;
    grades: { [k: number]: number };
    jlpt: { [k: number]: number };
    vocabulary: number;
}

export interface AllKanjiStats {
    total: number;
    grades: { [k: number]: number };
    jlpt: { [k: number]: number };
    frequencyMax: number;
}

export interface KanjiReport {
    user: string;
    created: number;
    counts: KanjiReportCounts;
}
