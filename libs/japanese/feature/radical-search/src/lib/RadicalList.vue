<style scoped>
.radical-15 {
    background-image: url(../../../../../../apps/japanese/src/assets/radical-15.png);
}
.radical-50 {
    background-image: url(../../../../../../apps/japanese/src/assets/radical-50.png);
}
.radical-76 {
    background-image: url(../../../../../../apps/japanese/src/assets/radical-76.png);
}
.radical-239 {
    background-image: url(../../../../../../apps/japanese/src/assets/radical-239.png);
}

.radicals .selected {
    border: 1px solid grey;
    background-color: lightgrey;
}

.radicals.filtering .highlight {
    color: red;
}

.radicals .next-radical {
    opacity: 1;
}
.radicals.filtering :not(.next-radical):not(.selected):not(.highlight) {
    opacity: 0.3;
}

.radicals > span {
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 24px;
    cursor: pointer;
    border-radius: 50%;
}
</style>

<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="9" md="4" lg="3">
                <v-text-field label="Radical Search" v-model="tagSearch" ref="input" />
            </v-col>

            <v-col cols="3" md="1">
                <v-btn text icon type="button" @click="resetValues()">
                    <v-icon>fas fa-redo</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <div class="radicals flex-items" :class="{ filtering: isFiltering }">
            <span
                v-for="item in radicals"
                :key="item.radical"
                :title="item.tags.join(', ')"
                :class="classesForRadical(item.radical)"
                :tabindex="getTabIndex(item.radical)"
                @click="emitSelectRadical(item.radical)"
                @keydown.space.prevent="emitSelectRadical(item.radical)"
                @keyup.esc="focusSearchInput()"
                >{{ resolveRadical(item.radical) }}</span
            >
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

const radicalMap = {
    // wrong interpreted radicals
    化: '亻',
    个: '𠆢',
    并: 'radical-15',
    刈: '刂',
    乞: '𠂉',
    込: '⻌',
    尚: 'radical-50',
    忙: '忄',
    扎: '扌',
    汁: '氵',
    犯: '犭',
    艾: '艹',
    邦: 'radical-76',
    阡: '阝',
    老: '耂',
    杰: '灬',
    礼: '礻',
    疔: '疒',
    禹: '禸',
    初: '衤',
    買: '罒',
    滴: 'radical-239',

    // Other form used more often
    竹: '⺮',
};

export default Vue.extend({
    props: {
        selectedRadicals: { type: Array, default: () => [] },
        nextRadicals: { type: Array, default: () => [] },
        radicals: { type: Array, default: () => [] },
    },
    data: () => ({
        tagSearch: '',
    }),
    methods: {
        isSelectedRadical(radical: string): boolean {
            return this.selectedRadicals.indexOf(radical) !== -1;
        },
        resolveRadicalClass(radical: string): string {
            const source = radicalMap[radical];
            if (source != null && source.length > 2) {
                return source;
            }

            return '';
        },
        classesForRadical(radical: string): string {
            const classes = [this.resolveRadicalClass(radical)];

            if (this.isSelectedRadical(radical)) classes.push('selected');
            if (this.tagSearchResult.includes(radical)) classes.push('highlight');
            if (this.nextRadicals.includes(radical)) classes.push('next-radical');

            return classes.filter((x) => x.trim() != '').join(' ');
        },
        resolveRadical(radical: string): string {
            const foundRadical = radicalMap[radical];
            if (foundRadical == null) return radical;
            if (foundRadical.length < 3) return foundRadical;

            return '';
        },
        emitSelectRadical(radical: string): void {
            if (
                !this.isSelectedRadical(radical) &&
                this.nextRadicals != null &&
                this.nextRadicals.length > 0 &&
                !this.nextRadicals.includes(radical)
            ) {
                return;
            }

            this.$emit('select-radical', {
                radical,
                selected: !this.isSelectedRadical(radical),
            });
        },
        resetValues(): void {
            this.tagSearch = '';
            this.$emit('reset');
        },
        getTabIndex(radical: string): number {
            if (this.selectedRadicals.includes(radical)) {
                return 0;
            }

            if (this.isSearching) {
                return this.tagSearchResult.includes(radical) ? 0 : -1;
            }

            if (this.nextRadicals.length == 0 || this.nextRadicals.includes(radical)) {
                return 0;
            }

            return -1;
        },
        focusSearchInput(): void {
            this.$refs.input.focus();
        },
        radicalIncludesTag(radical: Radical, tag: string): boolean {
            return radical.tags.some((t) => t.trim() != '' && t.includes(tag));
        },
        isNextRadicalIfNotEmpty(radical: Radical): boolean {
            return this.nextRadicals.length == 0 || this.nextRadicals.includes(radical.radical);
        },
    },
    computed: {
        isFiltering(): boolean {
            return this.isSearching || this.selectedRadicals.length > 0;
        },
        isSearching(): boolean {
            return this.tagSearch.trim() !== '';
        },
        tagSearchResult(): string[] {
            if (!this.isSearching) return [];

            return this.radicals
                .filter(
                    (r) =>
                        this.radicalIncludesTag(r, this.tagSearch) &&
                        this.isNextRadicalIfNotEmpty(r)
                )
                .map((r) => r.radical);
        },
    },
});

interface Radical {
    radical: string;
    stroke: number;
    tags: string[];
}

export interface SelectRadicalEvent {
    radical: string;
    selected: boolean;
}
</script>