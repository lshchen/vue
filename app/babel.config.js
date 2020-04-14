const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
// 去掉 console.log
const plugins = [];
if (IS_PROD) {
  plugins.push('transform-remove-console');
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins,
};

// 多页面打包 multi-page
// 利用 splitChunks 单独打包第三方模块
