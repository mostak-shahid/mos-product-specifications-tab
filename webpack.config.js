const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const SemiPlugin = require("@douyinfe/semi-webpack-plugin").default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
    ...defaultConfig,

    entry: {
        index: './src/index.jsx',
        'product-edit': './src/product-edit/index.jsx'
    },

    output: {
        filename: '[name].js',
        path: __dirname + '/build',
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },

            // Tailwind + CSS build output
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },

            // SCSS support
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },

            {
                test: /\.svg$/,
                use: ["file-loader"]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource',
                use: ["file-loader"]
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    externals: {
        react: "React",
        "react-dom": "ReactDOM",
        "@wordpress/element": "wp.element"
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new SemiPlugin({
            cssLayer: true
        }),
        new ModuleFederationPlugin({
            name: "pluginstarter",
            remotes: {
                pluginstarterpro: `pluginstarterpro@../../wp-content/plugins/mos-product-specifications-tab-pro/build/pluginstarterprocomponents.js"}`
            },
            shared: {
                react: { singleton: true, requiredVersion: false },
                "react-dom": { singleton: true, requiredVersion: false },
            }
        })
    ]
};
