<template>
    <v-row justify="center">
        <v-col cols="8" md="3">
            <v-file-input v-model="kanjiReportFile" />
        </v-col>
        <v-col cols="4" md="1">
            <v-btn @click="emitReportIfValid()">Add Report</v-btn>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Emit } from 'vue-property-decorator';

@Component
export default class AddReport extends Vue {
    kanjiReportFile: File = null;

    emitReportIfValid() {
        if (this.kanjiReportFile) {
            this.addReport();
        }
    }

    @Emit()
    addReport(): File {
        return this.kanjiReportFile;
    }
}
</script>