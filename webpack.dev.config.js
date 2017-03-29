var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var cssExtractor = new ExtractTextWebpackPlugin('./[name].css');
var lifecycleEvent = process.env.npm_lifecycle_event;

var devConfig = {
    entry: [
        './app/app.jsx',
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client'
    ],
    output: {
        publicPath: 'http://localhost:3000/',
        path: '/',
        filename: 'js/app.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                use: ['eslint-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader',
                    'postcss-loader?' + JSON.stringify(
                    [ autoprefixer({ browsers: ['last 3 versions'] }) ]
                )]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.(eot|ttf|woff|woff2|otf)$/,
                use: 'url-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|svg)$/,
                exclude: /favicon/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        // inject styles and javascript into index.html
        new HtmlWebpackPlugin({
            title: 'Webpack Build',
            template: './app/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        })
    ]
};

module.exports = devConfig;