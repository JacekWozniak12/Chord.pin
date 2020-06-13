module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    roots: ['<rootDir>'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    verbose: true,
    collectCoverageFrom:[
        "**/*.{js,jsx}",
        "!**/node_modules/**"
        ]    
}