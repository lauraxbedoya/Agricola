<script lang="ts">
import authServices from '@/api/authServices'
import type { User } from '../interfaces/User'
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export default {
  computed: {
    ...mapStores(useAuthStore)
  },
  data() {
    return {
      email: '',
      password: '',
      snackbar: {
        show: false,
        text: ''
      },
      formRules: {
        email: [
          (value: string) => {
            if (!value?.length) return 'Email is required.'
            if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid  Email'
            return true
          }
        ],
        password: [
          (value: string) => {
            if (value?.length < 3) return 'Password must be at least 8 characters long.'
            return true
          }
        ]
      }
    }
  },
  methods: {
    async submit(submitEventPromise: any) {
      const { valid } = await submitEventPromise
      if (!valid) {
        return // abort submit
      }

      const authenticated: boolean = await authServices.login(this.email, this.password)

      this.authStore.setIsAuthenticated(authenticated)

      if (authenticated) {
        const currentUser: User | undefined = await authServices.getCurrentUser()

        if (currentUser) {
          this.authStore.setUser(currentUser)
          await this.$router.push('/')
        }
      } else {
        this.$data.snackbar = {
          show: true,
          text: 'Invalid Credentials'
        }
      }
    }
  },
  async mounted() {
    if (this.authStore.isAuthenticated) {
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <v-sheet class="mx-auto mt-10" width="300">
    <h2 class="mb-3">Login</h2>
    <v-form fast-fail @submit.prevent="submit">
      <v-text-field v-model="email" :rules="formRules.email" label="Email"></v-text-field>

      <v-text-field
        type="password"
        v-model="password"
        :rules="formRules.password"
        label="Password"
      ></v-text-field>

      <v-btn type="submit" class="mt-2" block>Login</v-btn>
    </v-form>
  </v-sheet>

  <v-snackbar location="top right" v-model="snackbar.show" timeout="4000" color="red-lighten-1">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<style></style>
