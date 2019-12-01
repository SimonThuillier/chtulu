"use strict";
const path = require('path');
const Encore = require('@symfony/webpack-encore');
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

Encore
    .addEntry('noAuth', './assets/js/noAuth.jsx')
    .addEntry('auth', './assets/js/auth.jsx')
    .setOutputPath(path.join(__dirname,'/public/build/'))
    .setPublicPath('/build')
    .splitEntryChunks()
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .disableSingleRuntimeChunk()

    .configureLoaderRule('eslint', loaderRule => {
        loaderRule.test = /\.(jsx?|vue)$/
    })
    .addPlugin( new CKEditorWebpackPlugin( {
        // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
        language: 'fr'
    } ) )
    .addRule( {
    test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg|assets[/\\]js[/\\]ckeditor[/\\][^/\\]+\.svg$/,
    loader: 'raw-loader'
    })
    .configureLoaderRule( 'images', loader => {
        loader.exclude = /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$|assets[/\\]js[/\\]ckeditor[/\\][^/\\]+\.svg$/;
    } )
    .addLoader({
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
        loader: 'postcss-loader',
        options: styles.getPostCssConfig( {
            themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
            }
        } )
    } )
;



module.exports = Encore.getWebpackConfig();

/*module.exports.module.rules =
    [{
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: [ 'raw-loader' ]
    },
    {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
        use: [
            {
                loader: 'style-loader',
                options: {
                    injectType: 'singletonStyleTag'
                }
            },
            {
                loader: 'postcss-loader',
                options: styles.getPostCssConfig({
                    themeImporter: {
                        themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                    },
                    minify: true
                })
            }
        ]

    }
    ].concat(module.exports.module.rules);

const cssLoader = module.exports.module.rules.find(rule => rule.test.toString() === /\.(css)$/.toString());
//cssLoader.exclude = (cssLoader.exclude || []).concat([/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/]);

cssLoader.oneOf = [{
    test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
    use: [
        {
            loader: 'style-loader',
            options: {
                injectType: 'singletonStyleTag'
            }
        },
        {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig({
                themeImporter: {
                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                },
                minify: true
            })
        }
    ]}].concat(cssLoader.oneOf);

console.log("### infos css loader");
console.log(cssLoader);
console.log("### infos css loader detail");
console.log(cssLoader.oneOf[0]);
console.log("### infos css loader detail use");
console.log(cssLoader.oneOf[0].use);
console.log("### infos css loader detail2");
console.log(cssLoader.oneOf[1].exclude = [/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/]);
console.log(cssLoader.oneOf[2].exclude = [/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/]);
console.log(cssLoader.oneOf[1]);
console.log("### infos css loader detail2 use");
console.log(cssLoader.oneOf[1].use);


const svgLoader = module.exports.module.rules.find(rule => rule.test.toString().includes('|svg|') );
//console.log("### infos svg loader");
//console.log(svgLoader);
svgLoader.exclude = (svgLoader.exclude || []).concat([/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/]);

// console.log(module.exports);
//console.log(module.exports.module.rules);*/


