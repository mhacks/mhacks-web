const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const cssExtractor = new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
    ignoreOrder: false
});
const lifecycleEvent = process.env.npm_lifecycle_event;

let devConfig = {
    entry: ['./app/app.jsx'],
    output: {
        publicPath: '/',
        path: path.resolve('./build'),
        filename: 'js/app.js'
    },
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        modules: ['web_modules', 'node_modules', 'app', 'static'],
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
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader?' + JSON.stringify([autoprefixer()])
                ]
            },
            {
                test: /\.m?jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }
                            ],
                            '@babel/preset-react'
                        ]
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
        })
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './build',
        proxy: {
            '/api': {
                target: 'http://localhost:9090',
                xfwd: true,
                changeOrigin: true
            }
        }
    }
};

let buildConfig = {
    entry: ['./app/app.jsx'],
    output: {
        publicPath: '/',
        path: path.resolve('./build'),
        filename: 'js/app.js'
    },
    mode: 'production',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    optimization: {
        minimize: true
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
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            // {
            //     test: /\.(eot|ttf|woff|woff2|otf)(\?\S*)?$/,
            //     use: ['file-loader?name=fonts/[name].[ext]']
            // },
            {
                test: /\.(png|jpg|jpeg|gif|woff|svg|otf|mp4)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack Build',
            template: './app/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                'build/logo-title.png',
                'build/logo.png',
                'build/logo-media.png',
                'build/fonts',
                'build/js',
                'build/styles',
                'build/index.html'
            ]
        }),
        cssExtractor,
        new CopyWebpackPlugin([
            { from: './static/m13/favicon.png', to: './logo.png' },
            { from: './static/m13/logo.png', to: './logo-title.png' },
            { from: './static/m13/media.png', to: './logo-media.png' },
            { context: './app/favicon/', from: '**/*', to: './favicon/' },
            { context: './app/fonts/', from: '**/*', to: './fonts/' }
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './build',
        proxy: {
            '/api': {
                target: 'http://localhost:9090',
                xfwd: true,
                changeOrigin: true
            }
        }
    }
};

switch (lifecycleEvent) {
    case 'build':
        module.exports = buildConfig;
        break;
    default:
        module.exports = devConfig;
        break;
}
