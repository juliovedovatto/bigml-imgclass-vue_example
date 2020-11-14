<template lang="pug"></template>

<script>
export default {
  name: 'Logout',
  created() {
    this.logout()
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push({ name: 'auth' })
    }
  }
}
</script>
