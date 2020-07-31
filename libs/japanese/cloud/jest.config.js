module.exports = {
    name: 'japanese-cloud',
    preset: '../../../jest.config.js',
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
    coverageDirectory: '../../../coverage/libs/japanese/cloud',
};
