console.log(process.env.NODE_ENV);
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

const port = process.env.port || 900;
const path = require('path');
const fs = require('fs');
const glob = require('glob-all');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const PurgecssPlugin = require('purgecss-webpack-plugin');

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const pagesInfo = require("./src/pages.config");

const pages = {};
glob.sync('./src/pages/**/main.js').forEach(entry => {
  let chunk = entry.match(/\.\/src\/pages\/(.*)\/main\.js/)[1];
  const curr = pagesInfo[chunk];
  if (curr) {
    pages[chunk] = {
      entry,
      ...curr,
      chunk: ["chunk-vendors", "chunk-common", chunk]
    }
  }
});

// eslint-disable-next-line camelcase
let has_sprite = true;
let files = [];
const icons = {};
try {
  // eslint-disable-next-line no-use-before-define
  fs.statSync(resolveUrl('./src/assets/icons'));
  // eslint-disable-next-line no-use-before-define
  files = fs.readdirSync(resolveUrl('./src/assets/icons'));

  files.forEach((item) => {
    const filename = item.toLocaleLowerCase().replace(/_/g, '-');
    icons[filename] = true;
  });
} catch (error) {
  // eslint-disable-next-line no-use-before-define
  fs.mkdirSync(resolveUrl('./src/assets/icons'));
}
if (!files.length) {
  // eslint-disable-next-line camelcase
  has_sprite = false;
} else {
  try {
    // eslint-disable-next-line no-use-before-define
    let iconsObj = fs.readFileSync(resolveUrl('./icons.json'), 'utf8');
    iconsObj = JSON.parse(iconsObj);
    // eslint-disable-next-line camelcase
    has_sprite = files.some((item) => {
      const filename = item.toLocaleLowerCase().replace(/_/g, '-');
      return !iconsObj[filename];
    });
    // eslint-disable-next-line camelcase
    if (has_sprite) {
      // eslint-disable-next-line no-use-before-define
      fs.writeFileSync(resolveUrl('./icons.json'), JSON.stringify(icons, null, 2));
    }
  } catch (error) {
    // eslint-disable-next-line no-use-before-define
    fs.writeFileSync(resolveUrl('./icons.json'), JSON.stringify(icons, null, 2));
    // eslint-disable-next-line camelcase
    has_sprite = true;
  }
}
// 雪碧图样式处理模板
// eslint-disable-next-line no-unused-vars
const SpritesmithTemplate = function (data) {
  // pc
  // eslint-disable-next-line no-shadow
  const icons = {};
  let tpl = `.ico {
      display: inline-block;
      background-image: url(${data.sprites[0].image});
      background-size: ${data.spritesheet.width}px ${data.spritesheet.height}px;
  }`;
  data.sprites.forEach((sprite) => {
    const name = `${sprite.name.toLocaleLowerCase().replace(/_/g, '-')}`;
    icons[`${name}.png`] = true;
    tpl = `${tpl}
      .ico-${name}{
      width: ${sprite.width}px;
      height: ${sprite.height}px;
      background-position: ${sprite.offset_x}px ${sprite.offset_y}px;
    }`;
  });
  return tpl;
};
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
function resolveUrl(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  lintOnSave: false,
  productionSourceMap: false,
  // lintOnSave:process.env.NODE_ENV == 'development'
  devServer: {
    port,
    open: true,
    overlay: {
      warning: false,
      errors: true,
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathWrite: {
          [process.env.VUE_APP_BASE_API]: '',
        },
      },
    },
  },
  pages,
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    // 移除 preload 插件
    config.plugins.delete('preload');
    // 防止多页面打包卡顿
    config.plugins.delete("named-chunks");
    // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
    // eslint-disable-next-line no-param-reassign
    config.externals = {
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
    };
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none";
      return args;
    })
    const cdn = {
      css: ["//unpkg.com/element-ui@2.10.1/lib/theme-chalk/index.css"],
      js: [
        "//unpkg.com/vue@2.6.10/dist/vue.min.js",
        "//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js",
        "//unpkg.com/vuex@3.1.1/dist/vuex.min.js",
        "//unpkg.com/axios@0.19.0/dist/axios.min.js",
        "//unpkg.com/element-ui@2.10.1/lib/index.js"
      ]
    };
    // 多页面cdn添加
    Object.keys(pagesInfo).forEach(page => {
      config.plugin(`html-${page}`).tap(args => {
        // html中添加cdn
        args[0].cdn = cdn;
        // 修复 Lazy loading routes Error
        args[0].chunksSortMode = "none";
        return args;
      });

    });
    // 启用gzip
    if (IS_PROD) {
      const plugins = [];
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
        }),
      );
      // eslint-disable-next-line no-param-reassign
      config.plugins = [
        ...config.plugins,
        ...plugins,
      ];
    }
    // 修复HMR
    config.resolve.symlinks(true);

    // 添加别名
    // config.resolve.alias.set("vue$", "vue/dist/vue.esm.js")
    // 图片压缩
    if (IS_PROD) {
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false },
          webp: { quality: 75 },
        });
    }
    // 删除无效css
    if (IS_PROD) {
      const plugins = [];
      plugins.push(
        // eslint-disable-next-line no-undef
        new PurgecssPlugin({
          // eslint-disable-next-line no-undef
          paths: glob.sync([resolveUrl('./**/*.vue')]),
          extractors: [
            {
              extractor: class Extractor {
                static extract(content) {
                  const validSection = content.replace(
                    /<style([\s\S]*?)<\/style>+/gim,
                    '',
                  );
                  return validSection.match(/[A-Za-z0-9-_:/]+/g) || [];
                }
              },
              extensions: ['vue'],
            },
          ],
          whitelist: ['html', 'body'],
        }),
      );
      // eslint-disable-next-line no-param-reassign
      config.plugins = [...config.plugins, ...plugins];
    }
    // 删除comment包
    config
      .plugin('ignore')
      .use(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
      );
    const plugins = [];
    // eslint-disable-next-line camelcase
    if (has_sprite) {
      plugins.push(
        new SpritesmithPlugin({
          src: {
            cwd: path.resolve(__dirname, './src/assets/icons/'), // 图标根路径
            glob: '**/*.png', // 匹配任意 png 图标
          },
          target: {
            image: path.resolve(__dirname, './src/assets/images/sprites.png'), // 生成雪碧图目标路径与名称
            // 设置生成CSS背景及其定位的文件或方式
            css: [
              [
                path.resolve(__dirname, './src/assets/scss/sprites.scss'),
                {
                  format: 'function_based_template',
                },
              ],
            ],
          },
          customTemplates: {
            function_based_template: SpritesmithTemplate,
          },
          apiOptions: {
            cssImageRef: '../images/sprites.png', // css文件中引用雪碧图的相对位置路径配置
          },
          spritesmithOptions: {
            padding: 2,
          },
        }),
      );
    }
    // eslint-disable-next-line no-param-reassign
    config.plugins = [...config.plugins, ...plugins];
    if (IS_PROD) {
      config.optimization.delete("splitChunks");
    }
    return config;
  },
  configureWebpack: {
    name: 'app',
    resolve: {
      extensions: ['.js', '.css', '.json', '.vue'],
      alias: {
        '@': resolveUrl('src'),
        views: resolveUrl('src/views'),
        components: resolveUrl('src/components'),
      },
    },
    if (IS_PROD) {
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            common: {
              name: "chunk-common",
              chunks: "initial",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true
            },
            vendors: {
              name: "chunk-vendors",
              test: /[\\/]node_modules[\\/]/,
              chunks: "initial",
              priority: 2,
              reuseExistingChunk: true,
              enforce: true
            },
            elementUI: {
              name: "chunk-elementui",
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks: "all",
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            },
            echarts: {
              name: "chunk-echarts",
              test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
              chunks: "all",
              priority: 4,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
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
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        prependData: `
          @import "@scss/variables.scss";
          @import "@scss/mixins.scss";
          @import "@scss/function.scss";
          $src: "${process.env.VUE_APP_OSS_SRC}";
        `,
      },
    },
    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    requireModuleExtension: false,
  },
  // eslint-disable-next-line global-require
  parallel: require('os').cpus().length > 1,
};
