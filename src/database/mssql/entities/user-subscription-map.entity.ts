import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Subscription } from './subscription.entity'
import { User } from './user.entity'

@Entity('user_subscription_map')
export class UserSubscriptionMap {
  @PrimaryColumn('uuid')
  userId: string

  @PrimaryColumn('uuid')
  subscriptionId: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  paymentLink: string

  @Column({ type: 'datetime2', nullable: true })
  cancelledAt: Date

  @Column({ type: 'text', nullable: true })
  cancelReason: string

  @ManyToOne(() => User, (user) => user.userSubscriptions)
  @JoinColumn({ name: 'user_id' })
  user?: User

  @ManyToOne(() => Subscription, (subscription) => subscription.userSubscriptions)
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription
}
