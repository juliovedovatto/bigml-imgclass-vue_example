<template lang="pug">
  v-app
    v-app-bar(color="light" app v-if="isUserLoggedIn")
      v-img.shrink(:src="logo" height="50" transition="scale-transition" contain)

    v-main
      v-container(fill-height)
        router-view

    v-footer(dark v-if="isUserLoggedIn")
      v-img.shrink(:src="logoFooter" width="45" transition="scale-transition" contain)
</template>

<script>
import Logo from '@/assets/img/bigml.svg'
import LogoFooter from '@/assets/img/bigml-white.svg'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'App',
  metaInfo: {
    title: 'Home',
    titleTemplate: '%s | BigML'
  },
  computed: {
    ...mapState('auth', ['isUserLoggedIn']),
    logo() {
      return Logo
    },
    logoFooter() {
      return LogoFooter
    }
  },
  errorCaptured(error) {
    if (axios.isCancel(error)) {
      return false
    }
  }
}
</script>
