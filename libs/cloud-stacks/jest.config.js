module.exports = {
    name: 'cloud-stacks',
    preset: '../../jest.config.js',
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
    coverageDirectory: '../../coverage/libs/cloud-stacks',
};
