import type { User } from '@/interfaces/User'
import { defineStore } from 'pinia'

interface AuthState {
  isAuthenticated: boolean
  user?: User
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: undefined
  }),
  actions: {
    setIsAuthenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated
    },
    setUser(user?: User) {
      this.user = user
    },
    resetStore() {
      this.user = undefined
      this.isAuthenticated = false
    }
  },
  getters: {}
})
