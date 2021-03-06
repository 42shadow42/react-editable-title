const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    showcase: './src/dev/showcase.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'to-string-loader',
          {
            loader: 'css-loader',
            options: { modules: false }
          },
          'sass-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true }
          }
        ],
      },
      {
        test: /\.tsx$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.js', '.css']
  },
  devtool: 'inline-source-map',
  devServer: {
      contentBase: path.resolve(__dirname, 'src', 'dev')
  }
}
