<template>
    <div class="home">
        <v-row>
            <v-col>
                <v-file-input v-model="kanjiReportFile" />
                <v-btn>Create Report</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data: () => ({
        kanjiReportFile: null,
    }),
};
</script>
