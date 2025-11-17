import { BaseEntity } from './base.entity'

export class ShipmentEntity extends BaseEntity {
  carrierId: string

  status: string

  estimatedDeliveryDate: string
}
