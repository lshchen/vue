module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  settings: {
    "import/resolver": {
      "webpack": {
        "config": "node_modules/@vue/cli-service/webpack.config.js"
      }
    }
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "linebreak-style": [0 ,"error", "windows"],
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never',
      'scss': 'never'
    }]
  },
};
