import type { User } from '@/interfaces/User'
import { authEndpoints } from '@/config/appsettings.json'
import { storage, storageKeys } from '@/config/localStorage'
const BASE_API = import.meta.env.VITE_BASE_API

const authServices = {
  async login(email: string, password: string): Promise<boolean> {
    const response = await fetch(`${BASE_API}${authEndpoints.login}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    if (response.status === 200) {
      const { token } = await response.json()

      localStorage.setItem(storageKeys.JWT_TOKEN, token)

      return true
    } else {
      return false
    }
  },

  async register(name: string, email: string, password: string): Promise<boolean> {
    const response = await fetch(`${BASE_API}${authEndpoints.register}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })

    if (response.status === 200) {
      const { token } = await response.json()

      storage.set(storageKeys.JWT_TOKEN, token)
      return true
    } else {
      return false
    }
  },

  async getCurrentUser(): Promise<User | undefined> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return

    const response = await fetch(`${BASE_API}${authEndpoints.getCurrentUser}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      const currentUser: User = await response.json()

      return currentUser
    } else {
      storage.remove(storageKeys.JWT_TOKEN)
    }
  }
}

export default authServices
