import HtmlWebpackPlugin from "html-webpack-plugin";
import path from 'path';
import fs from "fs";

const __dirname = path.resolve();

const SOURCE = './src/';

let files = [];

let fileReader = fs.readdirSync(SOURCE);

fileReader.forEach(file => {
    let fileStat = fs.statSync(SOURCE + '/' + file).isDirectory();
    if (!fileStat) {
        files.push(file);
    }
});

files = files.filter(function (file) {
    return file !== 'index.js'
});

files = files.filter(function (file) {
    return file !== 'main.js'
});

let entry = {
    index: './src/index.js',
    main: './src/main.js'
};

let plugins = [];
let links = '';


files.forEach((file) => {
    let fileName = path.parse(file).name;
    links += `<li><a class="b-link" href="${fileName}.html">${fileName}</a></li>`;
    // links += `<li><a href="/dist/${fileName}.html">${fileName}</a></li>`;
});

files.forEach((file) => {
    let fileName = path.parse(file).name;
    entry[fileName] = SOURCE + file;
    plugins.push(new HtmlWebpackPlugin({
        template: 'template.html',
        title: fileName,
        nav: links,
        chunks: ['index', 'main', fileName],
        filename: `${fileName}.html`
    }))
});


export default {
    entry: entry,
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
    plugins: plugins,
};



