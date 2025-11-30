import { Column, Entity, OneToMany } from 'typeorm'

import { ENUM_SUBSCRIPTION_PLAN_TYPE } from '../../../config/enums'

import { BaseEntity } from './base.entity'
import { UserSubscriptionMap } from './user-subscription-map.entity'

@Entity('subscription')
export class Subscription extends BaseEntity {
  @Column({ type: 'int', generated: 'increment' })
  sequenceId: number

  @Column({ type: 'varchar', length: 20, generatedType: 'STORED', asExpression: "'SUB' + RIGHT('0000' + CAST(sequence_id AS VARCHAR), 4)", insert: false, update: false })
  subscriptionCode: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ type: 'varchar', enum: ENUM_SUBSCRIPTION_PLAN_TYPE, nullable: true })
  type: ENUM_SUBSCRIPTION_PLAN_TYPE

  @Column({ type: 'bit', nullable: false, default: true })
  isActive: boolean

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number

  @Column({ type: 'int', nullable: true })
  duration: number

  @OneToMany(() => UserSubscriptionMap, (userSubscriptionMap) => userSubscriptionMap.subscription)
  userSubscriptions?: UserSubscriptionMap[]
}
