import { groupsEndpoints } from '@/config/appsettings.json'
import { storage, storageKeys } from '@/config/localStorage'
import type { Group } from '@/interfaces/Group'
const BASE_API = import.meta.env.VITE_BASE_API

const groupServices = {
  async getGroupLots(groupId: string): Promise<Group[]> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return []

    const response = await fetch(`${BASE_API}${groupsEndpoints.groupsLots}${groupId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      const groups: Group[] = await response.json()

      return groups
    } else {
      return []
    }
  },

  async createGroup(group: Group): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${groupsEndpoints.createGroup}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lotId: group.lotId,
        name: group.name
      })
    })
    return response.status === 200
  },

  async editGroup(group: Group): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${groupsEndpoints.editGroup}${group.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: group.name
      })
    })
    return response.status === 200
  },

  async removeGroup(groupId: number): Promise<boolean> {
    const token = storage.get(storageKeys.JWT_TOKEN)

    if (!token) return false

    const response = await fetch(`${BASE_API}${groupsEndpoints.removeGroup}${groupId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    return response.status === 200
  }
}

export default groupServices
