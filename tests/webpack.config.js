const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './index.tsx',
    context: __dirname,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.mdx'],
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.mdx?$/,
                use: ['babel-loader', '@mdx-js/loader']
            },
            {
                test: /\.tsx?$/,
                use: ['babel-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
}