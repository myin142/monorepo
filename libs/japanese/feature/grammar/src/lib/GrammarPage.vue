<template>
    <div>
        <v-text-field label="Search Grammar" v-model="grammarSearch" @keyup="startSearch()" />

        <v-list v-if="grammarResult.length > 0">
            <v-card v-for="(item, i) in grammarResult" :key="i" style="margin-bottom: 1em;">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.name }} ({{ grammarTypes(item) }})
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span v-html="item.description" style="white-space: pre;"></span>
                            <v-list>
                                <v-list-item v-for="(link, i) in item.resources" :key="i">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            <a :href="link" target="blank">{{ link }}</a>
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-list>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import { Component, Inject, Watch } from 'vue-property-decorator';
import { grammars, Grammar, GrammarType } from './grammar';

const maxResult = 10;

export default Vue.extend({
    data: () => ({
        grammarSearch: '',
        grammarResult: [],
    }),
    created() {
        this.grammarResult = grammars.slice(0, maxResult);
    },
    methods: {
        grammarTypes(grammar: Grammar): string {
            return grammar.types.join(', ');
        },

        searchGrammarDebounced: _.debounce((ctx) => {
            ctx.searchGrammar();
        }, 500),

        searchGrammar(search: string = this.grammarSearch): void {
            this.grammarResult = grammars
                .filter((g) => {
                    return (
                        this.containsIgnoreCase(g.name, search) ||
                        this.containsIgnoreCaseArr(g.tags, search)
                    );
                })
                .slice(0, maxResult);
        },

        containsIgnoreCaseArr(arr: string[], y: string): boolean {
            return arr.some((x) => this.containsIgnoreCase(x, y));
        },

        containsIgnoreCase(x: string, y: string): boolean {
            return x.toLowerCase().includes(y.toLowerCase());
        },

        startSearch() {
            this.searchGrammarDebounced(this);
        },
    },
});
</script>
