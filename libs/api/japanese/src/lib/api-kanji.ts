export interface KanjiReportCounts {
    total: number;
    grades: { [k: number]: number };
    jlpt: { [k: number]: number };
    frequencies: number[];
}
