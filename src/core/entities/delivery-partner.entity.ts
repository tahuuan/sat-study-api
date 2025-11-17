import { BaseEntity } from './base.entity'
import { ShipmentEntity } from './shipment.entity'

export class DeliveryPartnerEntity extends BaseEntity {
  name: string

  serviceType: string

  contactPhone: string

  contactEmail: string

  shipments: ShipmentEntity[]
}
