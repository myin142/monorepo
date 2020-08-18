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
        description: '食べられる・話される、一段',
        types: [GrammarType.Verb],
        tags: ['られる', 'あれる', 'rareru', 'areru'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/causepass#Passive_Verbs',
        ],
    },
    {
        name: 'Potential',
        description: '食べられる・話せる、一段',
        types: [GrammarType.Verb],
        tags: ['られる', 'える', 'eru', 'rareru'],
        resources: [
            'www.guidetojapanese.org/learn/grammar/potential',
        ],
    },
    {
        name: 'Command',
        description: '食べろ・話せ',
        types: [GrammarType.Verb],
        tags: ['ro'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/requests#The_Command_Form',
        ],
    },
    {
        name: 'Negative Command',
        description: '食べるな・話すな',
        types: [GrammarType.Verb],
        tags: ['na'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/requests#Negative_Command',
        ],
    },
    {
        name: '~そう・Guessing outcome',
        description: '食べそう・食べなさそう\n高そう・よさそう',
        types: [GrammarType.Verb, GrammarType.Adjective],
        tags: ['sou', 'seem', 'like'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/similarity#Guessing_at_an_outcome_using',
        ],
    },
    {
        name: 'だらけ',
        description: '間違いだらけ・negative connotation',
        types: [GrammarType.Noun],
        tags: ['darake', 'riddled', 'littered', 'covered'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/covered#Using_when_an_object_is_riddled_everywhere_with_something',
        ],
    },
    {
        name: 'まみれ',
        description: '血まみれ・Only physical objects',
        types: [GrammarType.Noun],
        tags: ['mamire', 'covered', 'physical'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/covered#Using_to_describe_a_covering',
        ],
    },
    {
        name: 'ずくめ',
        description: '白ずくめ・"From head to toes"',
        types: [GrammarType.Noun],
        tags: ['zukume', 'entirety', 'covered', 'whole'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/covered#_to_express_entirety',
        ],
    },
    {
        name: 'によって',
        description: '理由・手段・それぞれ',
        types: [GrammarType.Noun],
        tags: ['niyotte', 'dependency', 'according', 'reason', 'method'],
        resources: [
            'http://www.guidetojapanese.org/learn/grammar/covered#_to_express_entirety',
            'https://japanese-teacher.tanosuke.com/2019/03/02/niyotte/',
        ],
    },
];

