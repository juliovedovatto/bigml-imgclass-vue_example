<i18n>
{
  "en": {
    "fields": {
      "username": {
        "label": "Username",
        "errors": {
          "empty": "Username field is required."
        }
      },
      "apiKey": {
        "label": "API Key",
        "errors": {
          "empty": "API Key field is required."
        }
      }
    },
    "actions": {
      "login": "Login"
    }
  }
}
</i18n>

<template lang="pug">
  v-form(ref="form" v-model="isValid" @submit.prevent="handleSubmit")
    v-container(fill-height)
      v-row(justify="center")
        v-col(md="4")
          v-text-field(
            :label="$t('fields.username.label')"
            :rules="rules.username"
            :value="username"
            name="username"
          )
      v-row(justify="center")
        v-col(md="4")
          v-text-field(
            :label="$t('fields.apiKey.label')"
            :rules="rules.apiKey"
            :value="apiKey"
            name="apiKey"
          )
      v-row(justify="center")
        v-col(md="4")
          v-btn.white--text(
            type="submit"
            width="100%"
            height="48"
            color="primary"
            :disabled="!isValid"
            :loading="loading"
          ) {{ $t('actions.login' )}}
</template>

<script>
export default {
  name: 'LoginForm',
  props: {
    username: {
      type: String,
      default: ''
    },
    apiKey: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isValid: false,
      rules: {
        username: [value => !!value || this.$t('fields.username.errors.empty')],
        apiKey: [value => !!value || this.$t('fields.apiKey.errors.empty')]
      }
    }
  },
  methods: {
    handleSubmit(event) {
      const formData = new FormData(event.target)
      this.$emit('auth:login', formData)
    }
  }
}
</script>
