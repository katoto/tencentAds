/**
 * Created by lichun on 2017/1/18.
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const srcPath = path.resolve(__dirname, '../src')
module.exports = {
    context: srcPath,
    entry: {
        app: [path.join(srcPath, 'main.js')],
        vendor: ['vue', 'vue-router', 'vuex', 'v-tap', 'vuex-router-sync', 'es6-promise', 'axios']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {'presets': ['vue-app'], 'babelrc': false, 'cacheDirectory': true}
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                include: [path.join(__dirname, '../', 'src/icons')],
                options: {
                    symbolId: 'icon-[name]'
                }
            },
            {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'less-loader' // compiles Less to CSS
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.vue'],
        alias: {
            '~': srcPath,
            '~common': path.join(srcPath, 'common'),
            '~store': path.join(srcPath, 'store'),
            '~components': path.join(srcPath, 'components'),
            '~pages': path.join(srcPath, 'pages'),
            '~assets': path.join(srcPath, 'assets'),
            'assets': path.join(srcPath, 'assets'),
            'vue$': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(srcPath, 'index.ejs'),
            chunks: ['manifest', 'vendor', 'app']
        })

    ]
}
