import { lotsEndpoints } from '@/config/appsettings.json'
import { storage, storageKeys } from '@/config/localStorage'
import type { Lot } from '@/interfaces/Lot'
const BASE_API = import.meta.env.VITE_BASE_API

const lotsServices = {
  async getLotsFarm(farmId: string): Promise<Lot[]> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return []

    const response = await fetch(`${BASE_API}${lotsEndpoints.lotsFarm}${farmId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      const lots: Lot[] = await response.json()

      return lots
    } else {
      return []
    }
  },

  async createLot(lot: Lot): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${lotsEndpoints.createLot}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        farmId: lot.farmId,
        name: lot.name,
        trees: lot.trees,
        stage: lot.stage
      })
    })
    return response.status === 200
  },

  async editLot(lot: Lot): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${lotsEndpoints.editLot}${lot.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: lot.name,
        trees: lot.trees,
        stage: lot.stage
      })
    })
    return response.status === 200
  },

  async removeLot(lotId: number): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${lotsEndpoints.removeLot}${lotId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    return response.status === 200
  }
}

export default lotsServices
