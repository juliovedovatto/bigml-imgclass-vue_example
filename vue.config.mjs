import { APP_VERSION, ENVIRONMENT } from './src/core/config'

import GitRevisionPlugin from 'git-revision-webpack-plugin'
import SentryWebpackPlugin from '@sentry/webpack-plugin'

import path from 'path'

const SENTRY_IGNORE = ['node_modules', 'vue.config.js']
const gitRevisionPlugin = new GitRevisionPlugin()

export default {
  transpileDependencies: ['vuetify'],

  configureWebpack() {
    const config = {
      resolve: {
        alias: {
          vue$: 'vue/dist/vue.esm.js',
          '@': path.resolve(__dirname, 'src/')
        }
      }
    }

    if (ENVIRONMENT === 'production') {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: './dist',
          ignore: SENTRY_IGNORE,
          release: APP_VERSION,
          setCommits: {
            repo: 'intellstartup/bigml-imgclass-vue',
            commit: gitRevisionPlugin.commithash()
          }
        })
      )
    }

    return config
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/scss/abstracts/variables.scss";'
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },

  chainWebpack(config) {
    config.amd(false)
  }
}
