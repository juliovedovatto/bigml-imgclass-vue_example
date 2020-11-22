<template lang="pug">
  v-app(v-if="canShowLayout")
    v-app-bar(color="light" app v-if="true")
      v-img.shrink(:src="logo" height="50" transition="scale-transition" contain)

    v-main
      v-container(fill-height)
        router-view
        .div(@click="closeAlert")
          v-snackbar(
            right
            :value="shouldShowAlert"
            :color="type"
            @input="closeAlert"
          ) {{ message }}


    v-footer(dark v-if="true")
      v-img.shrink(:src="logoFooter" width="45" transition="scale-transition" contain)

</template>

<script>
import Logo from '@/assets/img/bigml.svg'
import LogoFooter from '@/assets/img/bigml-white.svg'
import { REFRESH_TOKENS_INTERVAL } from '@/core/config'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'App',
  metaInfo: {
    title: 'Home',
    titleTemplate: '%s | BigML'
  },
  data: () => ({
    authPolling: null
  }),
  computed: {
    ...mapState('auth', ['isAuthVerified', 'isUserLoggedIn', 'isAuthRequired']),
    ...mapState('alert', ['type', 'message']),
    logo() {
      return Logo
    },
    logoFooter() {
      return LogoFooter
    },
    canShowLayout() {
      return this.isAuthVerified || !this.isAuthRequired
    },
    shouldShowAlert() {
      return !!this.message
    }
  },
  errorCaptured(error) {
    if (axios.isCancel(error)) {
      return false
    }
  },
  created() {
    this.authPolling = setInterval(this.refreshTokens, REFRESH_TOKENS_INTERVAL * 1000)
  },
  methods: {
    refreshTokens() {
      this.$store.dispatch('auth/refreshTokens')
    },
    closeAlert() {
      this.$store.dispatch('alert/clear')
    }
  }
}
</script>
