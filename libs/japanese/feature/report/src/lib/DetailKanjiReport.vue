<template>
    <v-row>
        <v-col cols="12">
            <canvas ref="gradeChart"></canvas>
        </v-col>
        <v-col cols="12">
            <canvas ref="jlptChart"></canvas>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Inject, Prop, Watch } from 'vue-property-decorator';
import { Chart } from 'chart.js';
import { KanjiReport, AllKanjiStats, KanjiReportCounts } from '@myin/japanese/interface';

@Component
export default class DetailKanjiReport extends Vue {
    @Prop() allKanjiStats: AllKanjiStats;
    @Prop() report: KanjiReport;

    private gradeChart: Chart;
    private jlptChart: Chart;

    mounted() {
        this.onReportChange(this.report);
    }

    private createBarChart(id: string): Chart {
        const canvas = this.$refs[id] as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Total',
                        data: [],
                        backgroundColor: 'rgba(50, 200, 50, 0.8)',
                    },
                    {
                        label: 'Learned',
                        data: [],
                        backgroundColor: 'rgba(50, 200, 50, 0.4)',
                    },
                ],
            },
            options: {
                scales: {
                    yAxes: [{ stacked: true, ticks: { beginAtZero: true } }],
                },
            },
        });
    }

    @Watch('report')
    onReportChange({ counts }: KanjiReport) {
        if (counts == null) return;

        if (!this.gradeChart) this.gradeChart = this.createBarChart('gradeChart');
        if (!this.jlptChart) this.jlptChart = this.createBarChart('jlptChart');

        const gradeData = this.createChartData(counts.grades, this.allKanjiStats.grades, 'Grade');
        const jlptData = this.createChartData(counts.jlpt, this.allKanjiStats.jlpt, 'JLPT');

        this.updateChart(this.gradeChart, gradeData);
        this.updateChart(this.jlptChart, jlptData);
    }

    private updateChart(chart: Chart, { labels, totals, learned }: ChartData) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = totals;
        chart.data.datasets[1].data = learned;
        chart.update();
    }

    private createChartData(counts: object, totalCounts: object, prefix = ''): ChartData {
        const labels = [];
        const totals = [];
        const learned = [];

        const labelPrefix = prefix ? `${prefix} ` : '';
        Object.keys(counts).forEach((key) => {
            labels.push(labelPrefix + key);
            totals.push(counts[key]);
            learned.push(totalCounts[key]);
        });

        return { labels, totals, learned };
    }
}

interface ChartData {
    labels: string[];
    totals: number[];
    learned: number[];
}
</script>