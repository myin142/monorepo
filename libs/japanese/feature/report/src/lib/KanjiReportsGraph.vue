<template>
    <canvas ref="reportChart" width="400" height="400"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Inject, Prop, PropSync, Watch } from 'vue-property-decorator';
import { KanjiReport } from '@myin/japanese/interface';
import { Chart } from 'chart.js';

@Component
export default class KanjiReportsGraph extends Vue {
    @Prop({ default: () => [] }) kanjiReports: KanjiReport[];

    private chart: Chart;

    mounted(): void {
        this.chart = new Chart(this.$refs.reportChart, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Test',
                        data: this.kanjiReports.map(this.reportToData),
                    },
                ],
            },
            options: {
                scales: {
                    xAxes: [{ type: 'time' }],
                    yAxes: [{ ticks: { beginAtZero: true } }],
                },
            },
        });
    }

    @Watch('kanjiReports')
    onReportsChange(reports: KanjiReport[]) {
        this.chart.data.datasets[0].data = reports.map(this.reportToData);
        this.chart.update();
    }

    private reportToData(report: KanjiReport): { t: Date; y: number } {
        return {
            t: new Date(report.created),
            y: report.counts.total,
        };
    }
}
</script>