const {
    VueLoaderPlugin
} = require('vue-loader')

module.exports = {
    entry: './src/main.ts',
    output: {
        path: __dirname,
        filename: 'bundle.js',
        publicPath: "/" // This is for dev server to send '/' on HTML5 history routes
    },
    devServer: {
        historyApiFallback: true, // This is also for HTML5 history routes
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    mode: "development", // vs. "production"
    resolve: {
        extensions: [".tsx", ".ts", ".js", '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};