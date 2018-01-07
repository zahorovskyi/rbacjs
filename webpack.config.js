const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'rbac',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            { test: /\.ts?$/, loader: 'ts-loader' }
        ]
    }
}