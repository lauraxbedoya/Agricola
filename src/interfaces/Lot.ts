import type { Farm } from './Farm'

export interface Lot {
  id?: number
  farmId: number
  name: string
  trees: number
  stage: string
  farm?: Farm
}
