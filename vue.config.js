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