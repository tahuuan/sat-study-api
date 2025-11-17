import { Column, Entity } from 'typeorm'

import { BaseEntity } from './base.entity'

@Entity()
export class Warehouse extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'int' })
  capacity: number

  @Column({ type: 'varchar', length: 255 })
  location: string
}
