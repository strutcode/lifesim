import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackDevServer from 'webpack-dev-server'

const watchMode = process.argv.includes('watch')

const compiler = webpack({
  entry: './src/index.ts',
  mode: watchMode ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.glsl$/,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  plugins: [new HtmlWebpackPlugin()],
  optimization: {
    usedExports: true,
    sideEffects: false,
    providedExports: true,
  },
  devtool: 'source-map',
})

if (watchMode) {
  const server = new WebpackDevServer(compiler)
  server.listen(8080)
} else {
  compiler.run(() => {})
}
