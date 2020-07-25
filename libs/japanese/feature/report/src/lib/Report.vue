<template>
    <div class="report">
        <v-row>
            <v-col>
                <v-file-input v-model="kanjiReportFile" />
                <v-btn @click="test()">Create Report</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Inject } from 'vue-property-decorator';
import { AuthService } from '@myin/shared/authentication';
import { JapaneseService } from '@myin/japanese/api';

@Component
export default class Report extends Vue {
    kanjiReportFile: File = null;

    @Inject()
    private japaneseService: JapaneseService;

    created() {}

    async test() {
        const report = await this.japaneseService.createKanjiReport(this.kanjiReportFile);
    }
}
</script>