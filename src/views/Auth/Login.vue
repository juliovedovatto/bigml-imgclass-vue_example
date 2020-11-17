<i18n>
{
  "en": {
    "error": {
      "unauthorized": "The credentials provided are incorrect. Check your credentials and try again."
    }
  }
}
</i18n>
<template lang="pug">
  v-container.container
    v-row(justify="center")
      v-col
        v-img(:src="logo" height="100" transition="scale-transition" contain)
        .name {{ $t('common.projectName') }}
    login-form(
      :username="username"
      :apiKey="apiKey"
      :loading="isLoginFormLoading"
      @auth:login="handleAuthLogin"
    )
</template>

<script>
import LoginForm from '@/components/Auth/LoginForm'
import Logo from '@/assets/img/bigml.svg'

export default {
  name: 'Login',
  components: {
    LoginForm
  },
  data() {
    return {
      username: 'easyeasy',
      apiKey: '316c82771ce938c045e603d9182b27b285d41bf8',
      error: null,
      isLoginFormLoading: false
    }
  },
  computed: {
    logo() {
      return Logo
    }
  },
  created() {
    // TODO: check if user is already logged
  },
  methods: {
    async handleAuthLogin(formData) {
      this.error = null
      this.isLoginFormLoading = true

      const username = formData.get('username')
      const apiKey = formData.get('apiKey')

      try {
        await this.$store.dispatch('auth/login', { username, apiKey })

        this.$router.push({ name: 'home' })
      } catch (err) {
        const { status = null } = err?.response || {}

        switch (status) {
          case 401: // Unautorized
            this.error = this.$t('error.unauthorized')
            break
          default:
            this.error = this.$t('common.error.general')
            // TODO: error handling
            console.error(err)
        }
      } finally {
        this.isLoginFormLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .name {
    text-align: center;
    font-size: 30px;
  }
}
</style>
