<script lang="ts">
import authServices from '@/api/authServices'
import type { User } from '@/interfaces/User'
import { useAuthStore } from '@/stores/authStore'
import { mapStores } from 'pinia'

export default {
  computed: {
    ...mapStores(useAuthStore)
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      snackbar: {
        show: false,
        text: ''
      },
      formRules: {
        name: [
          (value: string) => {
            if (!value?.length) return 'Name is required.'
            return true
          }
        ],
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

      const registered: boolean = await authServices.register(this.name, this.email, this.password)

      this.authStore.setIsAuthenticated(registered)

      if (registered) {
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

  mounted() {
    if (this.authStore.isAuthenticated) {
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <v-sheet class="mx-auto mt-10" width="300">
    <h2 class="mb-3">Register</h2>
    <v-form fast-fail @submit.prevent="submit">
      <v-text-field v-model="name" :rules="formRules.name" label="Name"></v-text-field>

      <v-text-field v-model="email" :rules="formRules.email" label="Email"></v-text-field>

      <v-text-field
        type="password"
        v-model="password"
        :rules="formRules.password"
        label="Password"
      ></v-text-field>

      <v-btn type="submit" class="mt-2" block>Sign up</v-btn>
    </v-form>
  </v-sheet>

  <v-snackbar location="top right" v-model="snackbar.show" timeout="4000" color="red-lighten-1">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<style></style>
