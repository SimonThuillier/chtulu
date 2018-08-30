"use strict";
const path = require('path');


module.exports = {
    mode: 'development',
    module: {
        rules: [
            { test: /\.jsx$/,
                exclude: /node_modules/,
                use: 'babel-loader' }
        ]
    },
    entry: './web/js/test-react.jsx',
    output: {
        filename: 'test-react-compiled.js',
        path: path.resolve(__dirname, 'web/js/'),
    }
};