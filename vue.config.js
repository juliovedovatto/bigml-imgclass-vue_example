require('@babel/register')({
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: ['@babel/plugin-transform-modules-commonjs']
})

module.exports = require('./vue.config.mjs').default
