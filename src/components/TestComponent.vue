<template lang="pug">
  .test-component
    h1 {{ msg }}
</template>

<script>
export default {
  name: 'TestComponent',
  props: {
    msg: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
