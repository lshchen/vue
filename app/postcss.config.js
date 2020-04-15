module.exports = {
  plugins: {
    autoprefixer: {
      Browserslist: ['Android >= 4.0', 'iOS >= 8'],
    },
    'postcss-pxtorem': {
      rootValue: 75,
      propList: ['*'],
    },
  },
};
