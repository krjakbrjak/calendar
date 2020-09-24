const path = require('path');

module.exports = (env = {}) => {
    return ({
        entry: './src/index.js',
        output: {
            path: path.resolve('dist'),
            filename: 'main.js',
            libraryTarget: 'umd',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader', 'eslint-loader'],
                },
                {
                    test: /\.css$/i,
                    exclude: /node_modules/,
                    use: ['style-loader', 'css-loader?modules'],
                },
            ],
        },
        resolve: {
            extensions: ['.js'],
        },
        externals: {
            react: {
                commonjs: "react",
                commonjs2: "react",
                amd: "React",
                root: "React"
            },
            "react-dom": {
                commonjs: "react-dom",
                commonjs2: "react-dom",
                amd: "ReactDOM",
                root: "ReactDOM"
            }
        }
    });
};
