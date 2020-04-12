const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const plugins = [];
if (IS_PROD) {
  plugins.push("transform-remove-console");
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins
};
// 压缩图片
//自动生成雪碧图
//多页面打包 multi-page
//利用 splitChunks 单独打包第三方模块
//开启 gzip 压缩
//去除多余无效的 css


