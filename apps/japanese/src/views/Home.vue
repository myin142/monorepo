<template>
    <div class="home">
        <v-row>
            <v-col>
                <v-file-input v-model="kanjiReportFile" />
                <v-btn @click="generateKanjiReport()">Create Report</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <canvas id="totalChart" width="400" height="400"></canvas>
            <canvas id="gradeChart" width="400" height="400"></canvas>
            <canvas id="jlptChart" width="400" height="400"></canvas>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Inject } from 'vue-property-decorator';
import { JapaneseService } from '@myin/japanese/api';
import { Chart } from 'chart.js';
import { AllKanjiStats } from '@myin/japanese/interface';

@Component
export default class Home extends Vue {
    kanjiReportFile: File = null;

    @Inject()
    private japaneseService: JapaneseService;
    private allKanjiStats: AllKanjiStats;

    async created() {
        this.allKanjiStats = await this.japaneseService.getAllKanjiStats();

        const canvas = this.$el.querySelector('#myChart') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total', 'Learned'],
                datasets: [{ label: 'Total', data: [1000, 200] }],
            },
            options: {
                scales: {
                    xAxes: [{ stacked: true }],
                },
            },
        });
    }

    async generateKanjiReport() {
        const report = await this.japaneseService.createKanjiReport(this.kanjiReportFile);
        const { total, grades, jlpt } = this.allKanjiStats;

        const gradeLabels = [];
        const gradeTotals = [];
        const gradeLearned = [];

        Object.keys(grades).forEach((grade) => {
            gradeLabels.push(`Grade ${grade}`);
            gradeTotals.push(grades[grade]);
            gradeLearned.push(report.grades[grade]);
        });

        this.createBarChart('gradeChart', gradeLabels, gradeTotals, gradeLearned);
    }

    private createBarChart(id: string, labels: string[], totals: number[], learned: number[]) {
        const canvas = this.$el.querySelector(`#${id}`) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const myPieChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Total',
                        data: totals,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    },
                    {
                        label: 'Learned',
                        data: learned,
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
}
</script>
