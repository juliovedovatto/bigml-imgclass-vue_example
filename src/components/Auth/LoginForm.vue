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
  v-form(v-model="isValid")
    v-container(fill-height)
      v-row(justify="center")
        v-col(md="4")
          v-text-field(
            :label="$t('fields.username.label')"
            :rules="rules.username"
          )
      v-row(justify="center")
        v-col(md="4")
          v-text-field(
            :label="$t('fields.apiKey.label')"
            :rules="rules.apiKey"
          )
      v-row(justify="center")
        v-col(md="4")
          v-btn.white--text(
            width="100%"
            height="48"
            color="primary"
            :disabled="!isValid"
            :loading="isLoading"
            @click="simulateLoading"
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
    }
  },
  data() {
    return {
      isValid: false,
      isLoading: false,
      rules: {
        username: [value => !!value || this.$t('fields.username.errors.empty')],
        apiKey: [value => !!value || this.$t('fields.apiKey.errors.empty')]
      }
    }
  },
  methods: {
    simulateLoading() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    }
  }
}
</script>
