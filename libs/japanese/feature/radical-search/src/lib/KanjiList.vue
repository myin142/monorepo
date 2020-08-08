<style scoped>
.kanjis span,
.token {
    cursor: pointer;
}
.token {
    padding: 0.5em;
}
</style>

<template>
    <div>
        <div class="kanjis flex-items">
            <span v-for="kanji in kanjis" :key="kanji" @click="addKanji(kanji)">{{ kanji }}</span>
        </div>
        <v-row justify="center">
            <v-col cols="12" sm="6" xl="10">
                <v-text-field label="Search" v-model="search" />
            </v-col>
            <v-col cols="6" sm="2" xl="1">
                <v-btn type="button" class="jisho btn btn-light" @click="redirectJisho()">
                    Jisho
                </v-btn>
            </v-col>
        </v-row>
        <div class="row justify-content-center mb-3">
            <div class="col-12 col-sm-8 col-xl-10"></div>
            <!-- <div class="col-6 col-sm-2 col-xl-1">
                <button type="button" class="tokenize btn btn-light" @click="tokenize()">
                    Tokenize
                </button>
            </div> -->
        </div>
        <!-- <div class="row">
            <div class="col-12">
                <span
                    class="token"
                    v-for="token in tokens"
                    :key="token.surface"
                    @click="redirectJisho(token.surface)"
                >
                    {{ token.surface }}
                </span>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import { japaneseService, Token } from '@/services/japanese.service';

export default Vue.extend({
    props: {
        kanjis: { type: Array, default: () => [] },
    },
    data: () => ({
        search: '',
        tokens: [],
        searchResult: [],
    }),
    methods: {
        addKanji(kanji: string): void {
            this.search += kanji;
        },
        redirectJisho(word = this.search): void {
            const url = `https://jisho.org/search/${word}`;
            window.open(url);
        },
        async tokenize() {
            // this.tokens = await japaneseService.analyze(this.search);
        },
    },
});
</script>