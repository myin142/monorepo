module.exports = {
    name: 'japanese-feature-radical-search',
    preset: '../../../../jest.config.js',
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
    coverageDirectory: '../../../../coverage/libs/japanese/feature/radical-search',
};
