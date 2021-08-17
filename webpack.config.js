import HtmlWebpackPlugin from "html-webpack-plugin";
import path from 'path';
const __dirname = path.resolve();

export default {
    entry: {
        'gosper_lines': './src/gosper_lines.js',
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Gosper Lines',
            chunks: ['gosper_lines'],
            filename: "gosper_lines.html"
        }),
    ],
};



