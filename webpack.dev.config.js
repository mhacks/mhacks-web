var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var autoprefixer = require('autoprefixer');

var devConfig = {
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    entry: [
        './app/app.jsx',
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client'
    ],
    output: {
        publicPath: (process.env.HOST || 'http://localhost:3000') + '/',
        path: '/',
        filename: 'js/app.js'
    },
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
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
                    [ autoprefixer() ]
                )]
            },
            {
                test: /\.m?jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [[
                        '@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs: 3
                        }
                    ], '@babel/preset-react']
                  }
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2|otf)$/,
                use: 'url-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|svg)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        // inject styles and javascript into index.html
        new HtmlWebpackPlugin({
            title: 'Webpack Build',
            template: './app/index-dev.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['build/logo-title.png', 'build/logo.png', 'build/logo-media.png', 'build/fonts', 'build/js', 'build/styles', 'build/index.html']
        }),
        new CopyWebpackPlugin([
            { from: './static/m11/favicon.png', to: './logo.png' },
            { from: './static/m11/logo.png', to: './logo-title.png' },
            { from: './static/m11/media.png', to: './logo-media.png' },
            { from: './app/favicon/', to: './favicon/'},
            { from: './app/fonts/', to: './fonts/' },
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

module.exports = devConfig;
