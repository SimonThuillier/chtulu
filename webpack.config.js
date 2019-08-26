"use strict";
const path = require('path');
const Encore = require('@symfony/webpack-encore');

Encore
    // .createSharedEntry('app', './assets/js/app.js')
    .addEntry('noAuth', './assets/js/noAuth.jsx')
    .addEntry('auth', './assets/js/auth.jsx')
    .setOutputPath(path.join(__dirname,'/public/build/'))
    .setPublicPath('/build')
    .splitEntryChunks()
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .disableSingleRuntimeChunk();

module.exports = Encore.getWebpackConfig();

/*
const configureEncore = () => {

    Encore
        .cleanupOutputBeforeBuild()
        .enableSourceMaps(!Encore.isProduction())
        .enableVersioning(Encore.isProduction())
        .disableSingleRuntimeChunk();
};



Encore
    .setOutputPath(path.join(__dirname,'/public/build/'))
    .setPublicPath('/build')
    .createSharedEntry('app', './assets/js/app.js')
    .addEntry('noAuth', './assets/js/noAuth.jsx');

configureEncore();
const noAuthConfig = Encore.getWebpackConfig();
noAuthConfig.name = 'noAuthConfig';
Encore.reset();

Encore
    .setOutputPath(path.join(__dirname,'/public/build/auth/'))
    .setPublicPath('/build/auth/')
    .addEntry('auth', './assets/js/auth.jsx');

configureEncore();
const authConfig = Encore.getWebpackConfig();
authConfig.name = 'authConfig';
Encore.reset();

module.exports = [noAuthConfig,authConfig];

*/



