"use strict";
const path = require('path');

var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('./public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/js/app.js')
    /*.addEntry('test-react', './assets/js/test-react.jsx')
    .addEntry('launcher', './assets/js/auth.jsx')
    .addEntry('test', './assets/js/async-index.js')
    .addEntry('test-react-router1', './assets/js/test-react-router1.jsx')
    .addEntry('test-react-router2', './assets/js/test-react-router2.jsx')*/
    //.addEntry('page1', './assets/js/page1.js')
    //.addEntry('page2', './assets/js/page2.js')
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .disableSingleRuntimeChunk()


// uncomment if you use TypeScript
//.enableTypeScriptLoader()

// uncomment if you use Sass/SCSS files
//.enableSassLoader()

// uncomment if you're having problems with a jQuery plugin
//.autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();

/*
module.exports = {
    mode: 'development',
    module: {
        rules: [
            // { test: /\.jsx$/,
            //     exclude: /node_modules/,
            //     use: 'babel-loader' },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    // entry: './web/js/test-react.jsx',
    // output: {
    //     filename: 'test-react-compiled.js',
    //     path: path.resolve(__dirname, 'web/js/'),
    // }
};*/