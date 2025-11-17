import { BaseEntity } from './base.entity'
import { StoreEntity } from './store.entity'
import { SupplierEntity } from './supplier.entity'
import { WarehouseEntity } from './warehouse.entity'

export class ProductEntity extends BaseEntity {
  name: string

  price: number

  category: string

  isAvailable: boolean

  version: number

  supplier?: SupplierEntity

  warehouse?: WarehouseEntity

  stores?: StoreEntity[]
}
