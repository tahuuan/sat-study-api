import { EmployeeType } from '../../config/enums'

import { BaseEntity } from './base.entity'
import { WarehouseEntity } from './warehouse.entity'

export class EmployeeEntity extends BaseEntity {
  name: string

  email: string

  phoneNumber: string

  type: EmployeeType

  warehouseId: string

  warehouse?: WarehouseEntity
}