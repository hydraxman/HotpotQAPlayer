const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")

const htmlPlugin = new HtmlWebPackPlugin({
    template: path.join(__dirname, './src/index.html'),
    filename: 'index.html'
})
const distPath = '../../src/main/resources/static/dist'
module.exports = {
    mode: "development",
    output: {
        path: path.join(__dirname, distPath),
        filename: 'bundle.js'
    },
    devServer: {
        port: 9999,
        proxy: {
            '/api': 'http://stcav-174.redmond.corp.microsoft.com:8888',
            '/crash': 'http://stcav-174.redmond.corp.microsoft.com:8888',
            '/oauth': 'http://stcav-174.redmond.corp.microsoft.com:8888',
            '/report': 'http://stcav-174.redmond.corp.microsoft.com:8888',
            '/mrc': 'http://localhost:9876',
            '/kaptcha': 'http://stcav-174.redmond.corp.microsoft.com:8888'
        }
    },
    plugins: [
        htmlPlugin,
        new CopyPlugin({
            patterns: [
                { from: path.join(__dirname, 'images'), to: path.join(__dirname, distPath + '/images') },
            ],
        }),
    ],
    module: {
        rules: [
            { test: /\.js|jsx$/, use: 'babel-loader', exclude: /node_modules/ },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: { localIdentName: '[path]-[name]-[local]-[hash:6]' }
                        }
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "[name].[hash:16].[ext]",
                            limit: 1024 * 8,
                            outputPath: "images",
                            publicPath: "assets/imgs",
                        },
                    }
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': path.join(__dirname, '/src')
        }
    }
}