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
    entry: {
        'main': './src/main.js',
        'kindex': './src/kindex.js',
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Main Management',
            chunks: ['main'],
            filename: "main.html"
        }),
        new HtmlWebpackPlugin({
            title: 'Kindex Management',
            chunks: ['kindex'],
            filename: "kindex.html"
        }),
    ],
};



