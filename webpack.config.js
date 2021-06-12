const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index_cube_brb.js',
    output: {
        filename: 'index_cube_brb.js',
        path: path.resolve(__dirname, 'dist'),
    },
    watch: true,
    watchOptions: {
        ignored: '/node_modules/'
    },
};