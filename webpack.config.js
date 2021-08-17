const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let htmlPageNames = ['example1', 'example2', 'example3', 'example4'];
let multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        filename: `${name}.html`, // output HTML files
        chunks: [`index`] // respective JS files
    })
});

module.exports = {
    mode: 'development',
    entry: {
        'index': './src/index.js',
        'test': './src/test.js'
    },
    output: {
        // filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: [0],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            chunks: [0],
            filename: 'test.html'
        })
    ],
};

