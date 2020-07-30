<template>
    <div class="report">
        <v-row>
            <v-col>
                <v-file-input v-model="kanjiReportFile" />
                <v-btn @click="test()">Create Report</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <kanji-reports-graph :kanji-reports="kanjiReports"></kanji-reports-graph>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Inject } from 'vue-property-decorator';
import { AuthService } from '@myin/shared/authentication';
import { JapaneseService } from '@myin/japanese/api';
import KanjiReportsGraph from './KanjiReportsGraph.vue';
import { KanjiReport } from '../../../../interface/src';

@Component({ components: { KanjiReportsGraph } })
export default class Report extends Vue {
    kanjiReportFile: File = null;
    kanjiReports: KanjiReport[] = [];

    @Inject()
    private japaneseService: JapaneseService;

    async created() {
        this.kanjiReports = await this.japaneseService.getKanjiReports();
    }

    async test() {
        const report = await this.japaneseService.createKanjiReport(this.kanjiReportFile);
    }
}
</script>