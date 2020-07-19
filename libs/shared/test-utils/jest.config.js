module.exports = {
    name: 'shared-test-utils',
    preset: '../../../jest.config.js',
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
    coverageDirectory: '../../../coverage/libs/shared/test-utils',
};
