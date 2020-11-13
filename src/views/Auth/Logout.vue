<template lang="pug"></template>

<script>
import { signOut } from '@/core/helpers/auth'

export default {
  name: 'Logout',
  created() {
    this.logout()
  },
  methods: {
    logout() {
      signOut()
      this.$router.push({ name: 'auth' })
    }
  }
}
</script>
