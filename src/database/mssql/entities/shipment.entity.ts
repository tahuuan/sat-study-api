import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from './base.entity'
import { DeliveryPartner } from './delivery-partner.entity'

@Entity()
export class Shipment extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  status: string

  @Column({ type: 'varchar', length: 50 })
  estimatedDeliveryDate: string

  @Column({ type: 'uuid' })
  carrierId: string

  @ManyToOne(() => DeliveryPartner)
  @JoinColumn({ name: 'carrier_id' })
  carrier: DeliveryPartner
}
