module.exports = {
    name: 'japanese-feature-report',
    preset: '../../../../jest.config.js',
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'vue', 'js', 'jsx', 'html'],
    coverageDirectory: '../../../../coverage/libs/japanese/feature/report',
};
