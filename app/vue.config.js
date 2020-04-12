console.log(process.env.NODE_ENV)
const webpack = require("webpack");
const port = process.env.port || 900;
const path = require('path')
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
function resolveUrl (dir) {
  return path.join(__dirname,dir)
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  lintOnSave: false,
  productionSourceMap: false,
  // lintOnSave:process.env.NODE_ENV == 'development'
  devServer: {
    port,
    open: true,
    overlay:{
      warning: false,
      errors: true
    },
    proxy:{
      [process.env.VUE_APP_BASE_API]:{
        target: "http://localhost:8080",
        changeOrigin: true,
        pathWrite: {
          [process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  },
  // pages: {},
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    // config.plugin("html").tap(args => {
    //   // 修复 Lazy loading routes Error
    //   args[0].chunksSortMode = "none";
    //   return args;
    // })
    // 添加别名
    // config.resolve.alias.set("vue$", "vue/dist/vue.esm.js")
    if (IS_PROD) {
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false }
          // webp: { quality: 75 }
        });
    }
    config
      .plugin("ignore")
      .use(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
      );
    return config;
  },
  configureWebpack:{
    name: "app",
    resolve: {
      extensions: ['.js', '.css', '.json', '.vue'],
      alias: {
        '@': resolveUrl('src'),
        'views':resolveUrl('src/views'),
        'components': resolveUrl('src/components')
      }
    }
  },
  pluginOptions: {},
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    extract: true,

    // 是否开启 CSS source map？
    sourceMap: false,

    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {},

    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    requireModuleExtension: false
  },
  parallel: require("os").cpus().length > 1,
};
