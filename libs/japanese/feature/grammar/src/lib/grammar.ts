export interface Grammar {
    name: string;
    description: string;
    types: GrammarType[];
    resources: string[];
    tags: string[];
}

export enum GrammarType {
    Noun = 'Noun',
    Verb = 'Verb',
    Adjective = 'Adjective',
    Particle = 'Particle',
}

export const grammars: Grammar[] = [
    {
        name: 'Passive',
        description: '食べられる・話される',
        types: [GrammarType.Verb],
        tags: ['passive', 'られる', 'れる', 'rareru', 'reru'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/causepass#Passive_Verbs',
        ],
    },
];
