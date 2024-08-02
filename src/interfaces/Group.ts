import type { Lot } from './Lot'

export interface Group {
  id?: number
  lotId: number
  name: string
  lot?: Lot
}
