import { farmsEndpoints } from '@/config/appsettings.json'
import { storage, storageKeys } from '@/config/localStorage'
import type { Farm } from '@/interfaces/Farm'
const BASE_API = import.meta.env.VITE_BASE_API

const farmsServices = {
  async getAllFarms(): Promise<Farm[]> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return []

    const response = await fetch(`${BASE_API}${farmsEndpoints.allFarms}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      const farms: Farm[] = await response.json()

      return farms
    } else {
      return []
    }
  },

  async createFarm(farm: Farm): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${farmsEndpoints.createFarm}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: farm.name,
        location: farm.location,
        hectares: farm.hectares,
        description: farm.description
      })
    })
    return response.status === 200
  },

  async editFarm(farm: Farm): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${farmsEndpoints.editFarm}${farm.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: farm.name,
        location: farm.location,
        hectares: farm.hectares,
        description: farm.description
      })
    })
    return response.status === 200
  },

  async removeFarm(farmId: number): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${farmsEndpoints.removeFarm}${farmId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    return response.status === 200
  }
}

export default farmsServices
