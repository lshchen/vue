const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const glob = require('glob-all');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const os = require('os');
const SpritesmithPlugin = require('webpack-spritesmith');
const BundleAnalyzer = require('webpack-bundle-analyzer');

const port = process.env.port || 900;
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
function resolve(dir) {
  return path.join(__dirname, dir);
}
let hasSprite = true;
let files = [];
const icons = {};
try {
  fs.statSync(resolve('src/assets/icons'));
  files = fs.readdirSync(resolve('src/assets/icons'));
  files.forEach((item) => {
    const filename = item.toLocaleLowerCase().replace(/_/g, '-');
    icons[filename] = true;
  });
} catch (error) {
  fs.mkdirSync(resolve('src/assets/icons'));
}
if (!files.length) {
  hasSprite = false;
} else {
  try {
    let iconsObj = fs.readFileSync(resolve('./icons.json'), 'utf8');
    iconsObj = JSON.parse(iconsObj);
    hasSprite = files.some((item) => {
      const filename = item.toLocaleLowerCase().replace(/_/g, '-');
      return !iconsObj[filename];
    });
    if (hasSprite) {
      fs.writeFileSync(resolve('./icons.json'), JSON.stringify(icons, null, 2));
    }
  } catch (error) {
    fs.writeFileSync(resolve('./icons.json'), JSON.stringify(icons, null, 2));
    hasSprite = true;
  }
}
// 雪碧图样式处理模板
const SpritesmithTemplate = function (data) {
  // pc
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
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'index',
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    login: {
      entry: 'src/pages/login.js',
      template: 'public/login.html',
      filename: 'login.html',
      title: 'login',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  chainWebpack: (config) => {
    // 修复HMR
    config.resolve.symlinks(true);
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    // 移除 preload 插件
    config.plugins.delete('preload');
    // 添加别名
    config.resolve.alias.set('@', resolve('src'))
      .set('@scss', resolve('src/assets/scss'));
    // 压缩图片
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
          // webp: { quality: 75 }
        });
    }
    // 删除 moment 语言包
    config.plugin('ignore').use(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
    );
    // 打包分析
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzer.BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static',
        },
      ]);
    }
    return config;
  },
  configureWebpack: (config) => {
    const plugins = [];
    // 生成雪碧图
    if (hasSprite) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.modules = ['node_modules', './src/assets/images/icons'];
      plugins.push(
        new SpritesmithPlugin({
          src: {
            cwd: path.resolve(__dirname, './src/assets/icons/'), // 图标根路径
            glob: '*.png', // 匹配任意 png 图标
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
            // eslint-disable-next-line camelcase
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
    // 去除无效css
    if (IS_PROD) {
      plugins.push(
        new PurgecssPlugin({
          paths: glob.sync([
            path.join(__dirname, './src/index.html'),
            path.join(__dirname, './**/*.vue'),
            path.join(__dirname, './src/**/*.js'),
          ]),
        }),
      );
    }
    // 提取公共代码
    if (IS_PROD) {
      // eslint-disable-next-line no-param-reassign
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            common: {
              name: 'chunk-common',
              chunks: 'initial',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true,
            },
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'initial',
              priority: 2,
              reuseExistingChunk: true,
              enforce: true,
            },
            elementUI: {
              name: 'chunk-elementui',
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks: 'all',
              priority: 3,
              reuseExistingChunk: true,
              enforce: true,
            },
            echarts: {
              name: 'chunk-echarts',
              test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
              chunks: 'all',
              priority: 4,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    // 开启 gzip 压缩
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
        }),
      );
    }
    // eslint-disable-next-line no-param-reassign
    config.plugins = [...config.plugins, ...plugins];
  },
  pluginOptions: {},
  parallel: os.cpus().length > 1,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  pwa: {},
};
