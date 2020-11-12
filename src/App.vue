<template lang="pug">
  v-app
    // TODO: Separate logged content
    //- v-app-bar(color="light" app)
    //-   v-img.shrink(:src="logo" height="50" transition="scale-transition" contain)

    v-main
      v-container(fill-height)
        router-view

    //- v-footer(dark)
    //-   v-img.shrink(:src="logoFooter" width="45" transition="scale-transition" contain)
</template>

<script>
import Logo from '@/assets/img/bigml.svg'
import LogoFooter from '@/assets/img/bigml-white.svg'
import axios from 'axios'

export default {
  name: 'App',
  metaInfo: {
    title: 'Home',
    titleTemplate: '%s | BigML'
  },
  errorCaptured(error) {
    if (axios.isCancel(error)) {
      return false
    }
  },
  computed: {
    logo() {
      return Logo
    },
    logoFooter() {
      return LogoFooter
    }
  }
}
</script>
