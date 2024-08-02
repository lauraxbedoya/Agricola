<script lang="ts">
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import { storage, storageKeys } from '@/config/localStorage'

export default {
  computed: {
    ...mapStores(useAuthStore)
  },
  methods: {
    logout() {
      //remove token from local storage
      storage.remove(storageKeys.JWT_TOKEN)

      this.authStore.resetStore()

      this.$router.push('/login')
    }
  }
}
</script>

<template>
  <v-app-bar color="primary" prominent>
    <v-toolbar-title>
      <RouterLink to="/">Agrícola</RouterLink>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <div class="d-flex justify-content-end">
      <div v-if="!authStore.isAuthenticated">
        <v-btn>
          <RouterLink to="/login">Login</RouterLink>
        </v-btn>

        <v-btn>
          <RouterLink to="/register">Register</RouterLink>
        </v-btn>
      </div>
      <div v-else class="d-flex align-center">
        <v-btn>
          <RouterLink to="/users">Users</RouterLink>
        </v-btn>
        <v-btn>
          <RouterLink to="/farms">Farms</RouterLink>
        </v-btn>
        <v-btn @click="logout">
          <span>Logout</span>
        </v-btn>
        <h4 class="mx-4">{{ authStore.user?.name }}</h4>
      </div>
    </div>
  </v-app-bar>
</template>

<style lang="css" scoped>
span.v-btn__content a,
.v-toolbar-title__placeholder a {
  color: white;
  text-decoration: none;
}
</style>
