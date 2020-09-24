const path = require('path');

module.exports = (env = {}, { mode }) => {
    jsXLoaders = ['babel-loader'];
    // Use eslint only during production build
    if (mode === 'production') {
        jsXLoaders.push('eslint-loader');
    }

    return ({
        entry: path.resolve(__dirname, 'src/index.js'),
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
                    use: jsXLoaders,
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
