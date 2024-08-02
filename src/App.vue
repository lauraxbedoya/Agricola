<script lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import { useAuthStore } from './stores/authStore'
import type { User } from './interfaces/User'
import { mapStores } from 'pinia'
import authServices from './api/authServices'

export default {
  components: {
    HeaderComponent,
    RouterView
  },
  computed: {
    ...mapStores(useAuthStore)
  },
  async mounted() {
    const currentUser: User | undefined = await authServices.getCurrentUser()

    if (currentUser) {
      this.authStore.setIsAuthenticated(true)
      this.authStore.setUser(currentUser)
    }
  }
}
</script>

<template>
  <v-layout>
    <HeaderComponent />
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>

<style scoped></style>
