import type { User } from '@/interfaces/User'
import { usersEndpoints } from '@/config/appsettings.json'
import { storage, storageKeys } from '@/config/localStorage'
const BASE_API = import.meta.env.VITE_BASE_API

const usersServices = {
  async getAllUsers(): Promise<User[]> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return []

    const response = await fetch(`${BASE_API}${usersEndpoints.allUsers}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      const users: User[] = await response.json()

      return users
    } else {
      return []
    }
  },

  async removeFarm(userId: number): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${usersEndpoints.removeUser}${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    return response.status === 200
  },

  async editFarm(user: User): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${usersEndpoints.editUser}${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email
      })
    })
    return response.status === 200
  }
}

export default usersServices
