import { Column, Entity, Index } from 'typeorm'

import { BaseEntity } from './base.entity'

@Entity()
export class Customer extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: false })
  email: string

  @Column({ type: 'varchar', nullable: true })
  address: string

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string
}
