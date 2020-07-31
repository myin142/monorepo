<template>
    <div class="report">
        <add-report @add-report="createReport($event)"></add-report>
        <v-row v-if="kanjiReports.length > 0">
            <v-col md="6">
                <kanji-reports-graph
                    :kanji-reports="kanjiReports"
                    :max-kanjis="allKanjiStats.total"
                ></kanji-reports-graph>
            </v-col>
            <v-col md="6">
                <detail-kanji-report
                    v-if="selectedReport"
                    :report="selectedReport"
                    :all-kanji-stats="allKanjiStats"
                ></detail-kanji-report>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import KanjiReportsGraph from './KanjiReportsGraph.vue';
import AddReport from './AddReport.vue';
import DetailKanjiReport from './DetailKanjiReport.vue';
import { Component, Inject } from 'vue-property-decorator';
import { AuthService } from '@myin/shared/authentication';
import { JapaneseService } from '@myin/japanese/api';
import { KanjiReport, AllKanjiStats } from '../../../../interface/src';

@Component({ components: { KanjiReportsGraph, AddReport, DetailKanjiReport } })
export default class Report extends Vue {
    kanjiReports: KanjiReport[] = [];
    selectedReport: KanjiReport = null;
    allKanjiStats: AllKanjiStats = null;

    @Inject()
    private japaneseService: JapaneseService;

    async created() {
        this.allKanjiStats = await this.japaneseService.getAllKanjiStats();
        this.kanjiReports = await this.japaneseService.getKanjiReports();
        this.selectedReport = this.kanjiReports[0];
    }

    async createReport(reportFile: File) {
        const report = await this.japaneseService.createKanjiReport(reportFile);
        this.kanjiReports.push(report);
        this.selectedReport = report;
    }
}
</script>