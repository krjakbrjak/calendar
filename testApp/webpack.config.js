const path = require('path');

module.exports = (env = {}) => {
    return ({
        devtool: 'inline-source-map',
        mode: 'development',
        entry: path.resolve(__dirname, 'src/index.js'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',
            publicPath: '/',
        },
        devServer: {
            contentBase: __dirname,
            port: 9001,
            inline: true,
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
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
    });
};
