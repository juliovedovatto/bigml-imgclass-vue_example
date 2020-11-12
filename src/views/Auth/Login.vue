<template lang="pug">
  v-container.container
    v-row(justify="center")
      v-col
        v-img(:src="logo" height="100" transition="scale-transition" contain)
        .name {{ $t('common.projectName') }}
    login-form(
      :username="username"
      :apiKey="apiKey"
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
      username: '',
      apiKey: ''
    }
  },
  computed: {
    logo() {
      return Logo
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
