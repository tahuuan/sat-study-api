import { Column, Entity } from 'typeorm'

import { BaseEntity } from './base.entity'

@Entity()
export class DeliveryPartner extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  serviceType: string

  @Column({ type: 'varchar', length: 20 })
  contactPhone: string

  @Column({ type: 'varchar', length: 255 })
  contactEmail: string
}
