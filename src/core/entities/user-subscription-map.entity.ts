import { SubscriptionEntity } from './subscription.entity'
import { UserEntity } from './user.entity'

export class UserSubscriptionMapEntity {
  userId: string
  subscriptionId: string
  status?: string
  paymentLink?: string
  cancelledAt?: Date
  cancelReason?: string

  user?: UserEntity
  subscription?: SubscriptionEntity
}