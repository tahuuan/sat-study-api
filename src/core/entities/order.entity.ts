import { Status } from '../../config/enums'

import { BaseEntity } from './base.entity'
import { OrderDetailEntity } from './order-detail.entity'
import { ShipmentEntity } from './shipment.entity'

export class OrderEntity extends BaseEntity {
  customerId: string

  status: Status

  orderDate: Date

  totalAmount: number

  orderDetails: OrderDetailEntity[]

  warehouseId: string

  shipmentId?: string

  shipment?: ShipmentEntity
}
