<template>
    <canvas ref="reportChart" width="400" height="400"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { KanjiReport } from '@myin/japanese/interface';
import { Chart } from 'chart.js';

@Component
export default class KanjiReportsGraph extends Vue {
    @Prop({ default: () => [] }) kanjiReports: KanjiReport[];
    @Prop() maxKanjis: number;

    private chart: Chart;

    mounted(): void {
        const { min, max } = this.getMinMaxDate();
        const maxData = [
            { t: min, y: this.maxKanjis },
            { t: max, y: this.maxKanjis },
        ];

        this.chart = new Chart(this.$refs.reportChart, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Kanji',
                        data: this.kanjiReports.map(this.toKanjiData),
                        backgroundColor: 'rgba(50, 200, 50, 0.5)',
                        borderColor: 'rgba(50, 200, 50, 0.8)',
                    },
                    {
                        label: 'Vocabulary',
                        data: this.kanjiReports.map(this.toVocabularyData),
                        backgroundColor: 'rgba(200, 50, 50, 0.5)',
                        borderColor: 'rgba(200, 50, 50, 0.8)',
                    },
                    {
                        label: 'Max Kanjis',
                        data: maxData,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 0.8)',
                    },
                ],
            },
            options: {
                scales: {
                    xAxes: [{ type: 'time' }],
                },
            },
        });
    }

    private getMinMaxDate(): { min: Date; max: Date } {
        const dates = this.kanjiReports.map((x) => x.created);
        return {
            min: new Date(Math.min.apply(null, dates)),
            max: new Date(Math.max.apply(null, dates)),
        };
    }

    @Watch('kanjiReports')
    onReportsChange(reports: KanjiReport[]) {
        this.chart.data.datasets[0].data = reports.map(this.toKanjiData);
        this.chart.data.datasets[1].data = reports.map(this.toVocabularyData);
        this.chart.data.datasets[2].data[1].t = new Date(
            Math.max.apply(
                null,
                reports.map((x) => x.created)
            )
        );
        this.chart.update();
    }

    private toKanjiData(report: KanjiReport): { t: Date; y: number } {
        return {
            t: new Date(report.created),
            y: report.counts.total,
        };
    }

    private toVocabularyData(report: KanjiReport): { t: Date; y: number } {
        return {
            t: new Date(report.created),
            y: report.counts.vocabulary,
        };
    }
}
</script>