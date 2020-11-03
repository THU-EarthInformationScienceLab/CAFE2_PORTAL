const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  devServer: {
    proxy: 'http://localhost:4000',
  },
  configureWebpack: config => {
    if (isProduction) {
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          minSize: 10000,
          maxSize: 2000000,
        },
      }
    }
  },
  // chainWebpack: config => {
  //   config
  //     .plugin('webpack-bundle-analyzer')
  //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  // },
}
