import { WarehouseEntity } from './warehouse.entity'

export class StoreEntity {
  warehouseId: string

  productId: string

  warehouse: WarehouseEntity
}
