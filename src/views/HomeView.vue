<script lang="ts">
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export default {
  computed: {
    ...mapStores(useAuthStore)
  }
}
</script>

<template>
  <main class="d-flex justify-center align-center py-10">
    <h2 v-if="authStore.isAuthenticated">Welcome {{ authStore.user?.name.toUpperCase() }}</h2>
    <h2 v-else>Welcome to Agrícola, please Log in or Register</h2>
  </main>
</template>
