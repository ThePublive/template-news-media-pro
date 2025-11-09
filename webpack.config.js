const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

console.log('Resolved output path:', path.resolve(__dirname, './assets/bundles'));

module.exports = {
    entry: {
        style: './assets/css/index.css',
        index: './assets/js/index.js',
        post: './assets/js/post.js',
        bookmark: './assets/js/bookmark.js',
        mobile_universal: './assets/css/mobile_universal.css',
        desktop_universal: './assets/css/universal.css',
        media_query: './assets/css/media_query.css',
        desktop_home: './assets/css/pages/desktop_home.css',
    },
    output: {
        filename: "[name]_bundle.js",
        path: path.resolve(__dirname, './assets/bundles'),
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'), // Ensure correct path to node_modules
            'node_modules'
        ],
        extensions: ['.js', '.css'],
    },
    devServer: {
        port: 9000,
    },
    mode: 'development',
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css", // Customize if needed
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jquery': 'jquery',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpg|webp|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // Set a limit in bytes or remove if not needed
                        },
                    }
                ],
            }
        ]
    }
}