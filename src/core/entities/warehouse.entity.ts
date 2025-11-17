import { BaseEntity } from "./base.entity"
import { StoreEntity } from "./store.entity"

export class WarehouseEntity extends BaseEntity {
  name: string

  capacity: number

  location: string

  stores: StoreEntity[]
}
