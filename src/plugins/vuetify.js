import SASS_VARIABLES from '@/assets/scss/main.scss'

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: {
          base: SASS_VARIABLES.primary,
          lighten1: SASS_VARIABLES.primaryLight,
          lighten2: SASS_VARIABLES.primaryLighter
        },
        secondary: {
          base: SASS_VARIABLES.secondary,
          lighten1: SASS_VARIABLES.secondaryLight,
          lighten2: SASS_VARIABLES.secondaryLighter
        }
      }
    }
  }
})
