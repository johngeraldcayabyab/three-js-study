import HtmlWebpackPlugin from "html-webpack-plugin";
import path from 'path';

const __dirname = path.resolve();

export default {
    entry: {
        'gosper_lines': './src/gosper_lines.js',
        'particle_ball_sunk_in_surface': './src/particle_ball_sunk_in_surface.js',
        'instanced_grass': './src/instanced_grass.js',
        'terrain_test': './src/terrain_test.js',
        'refraction_dynamic_geometry': './src/refraction_dynamic_geometry.js',
        'draggable_geometries': './src/draggable_geometries.js',
        'morphing_blob': './src/morphing_blob.js',
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
            template: 'template.html',
            title: 'Gosper Lines',
            chunks: ['gosper_lines'],
            filename: "gosper_lines.html"
        }),
        new HtmlWebpackPlugin({
            template: 'template.html',
            title: 'Particle Ball Sunk In Surface',
            chunks: ['particle_ball_sunk_in_surface'],
            filename: "particle_ball_sunk_in_surface.html"
        }),
        new HtmlWebpackPlugin({
            template: 'template.html',
            title: 'Instanced Grass',
            chunks: ['instanced_grass'],
            filename: "instanced_grass.html"
        }),
        new HtmlWebpackPlugin({
            template: 'template.html',
            title: 'Terrain Test',
            chunks: ['terrain_test'],
            filename: "terrain_test.html"
        }),
        new HtmlWebpackPlugin({
            template: 'template.html',
            title: 'Refraction Dynamic Geometry',
            chunks: ['refraction_dynamic_geometry'],
            filename: "refraction_dynamic_geometry.html"
        }),
        new HtmlWebpackPlugin({
            template: 'template.html',
            title: 'Draggable Geometries',
            chunks: ['draggable_geometries'],
            filename: "draggable_geometries.html"
        }),
        new HtmlWebpackPlugin({
            template: 'template.html',
            title: 'Morphing Blob',
            chunks: ['morphing_blob'],
            filename: "morphing_blob.html"
        }),
    ],
};



