const path = require("path");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PostCSSPlugin = [
    require('autoprefixer'),
    require('postcss-mixins'),
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-import')
];

const currentTask = process.env.npm_lifecycle_event;

let cssConfig = {
    test: /\.css$/i,
    use: ['css-loader']

};

const config = {
    entry: {
        app: './app/assets/scripts/App.js'
    },
    plugins: [
        new HtmlWebpackPlugin({ filename: 'index.html', template: './app/assets/index.html' })],
    module: {
        rules: [
            cssConfig
        ]
    },
}


if (currentTask == "dev") {
    config.mode = "development";
    cssConfig.use.unshift('style-loader');
    cssConfig.use.push({
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: PostCSSPlugin
            }
        }
    });
    config.output = {
        path: path.resolve(__dirname, 'app'),
        clean: true
    }
    config.devServer = {
        watchFiles: ["./app/**/*.html"],
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000,
        hot: true
    }

}
if (currentTask == "build") {
    config.mode = "production";
    cssConfig.use.unshift(MiniCssExtractPlugin.loader);
    config.plugins.push(new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' }))
    config.output = {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: true
    }
    config.optimization = {
        splitChunks: {
            chunks: 'all',
            minSize: 1000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    }

}


module.exports = config;