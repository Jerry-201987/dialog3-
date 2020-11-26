let path = require('path')
// const { config } = require('vue/types/umd')
function resolve(url) {
    return path.resolve(__dirname, url)
}
module.exports = {
    lintOnSave: false,
    // configureWebpack: {
    //     resolve: {
    //         alias: {
    //             '_': resolve('src/components'),
    //             '_p': resolve('src/page')
    //         }
    //     }
    // },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('~', resolve('src/components'))
            .set('~~', resolve('src/page'))
    },
    devServer: {
        open: true,
        port: 8888,
        contentBase: path.join(__dirname, 'static')
    }
}
----------------------------------------------------------
const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  // baseUrl: '/',
  lintOnSave: false,
  publicPath: require('./config/aurora').contextPath,
  outputDir: 'portal',
  assetsDir: 'assets',
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: true,
  css: {
    // 是否提取css 生产环境可以配置为 true
    extract: false
  },
  devServer: {
    https: true,
    host: '10.130.26.203',
    port: 9002, // 本机端口
    disableHostCheck: true,
    // before: require('./web/mock/mock-server.js'), // 开启mock模式，在web/mock目录下面建立跟src/api 一一映射的接口。如果开发测试连接后端，请注释掉这里，然后使用下面的proxy配置
    proxy: {
      // 开发模式下拦截的二级域
      '/': {
        // target: 'https://10.130.41.73:8447', // guo
        target: 'https://10.130.26.203:8447', // jun
        changOrigin: true,
        secure: false,
        // pathRequiresRewrite: {
        //   '^/': '/'
        // }
      }
    } 
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_api', resolve('src/api'))
      .set('_components', resolve('src/components'))
      .set('_views', resolve('src/views'))
      .set('_utils', resolve('src/utils'))
      .set('_assets', resolve('src/assets'))
      .set('_css', resolve('src/assets/css'))
      .set('_images', resolve('src/assets/images'))
  }
}
