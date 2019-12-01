module.exports = {
  mode: 'development',
  entry: "./src/index.ts",
  output: {
    filename: "dist/bundle.js"
  },
  resolve: {
    extensions: ['.js', ".ts"]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  }
};
