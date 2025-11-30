import { ENUM_SUBSCRIPTION_PLAN_TYPE } from '../../config/enums'

import { BaseEntity } from './base.entity'
import { UserSubscriptionMapEntity } from './user-subscription-map.entity'

export class SubscriptionEntity extends BaseEntity {
  description?: string
  name: string
  type?: ENUM_SUBSCRIPTION_PLAN_TYPE
  isActive: boolean
  price?: number
  duration?: number

  userSubscriptions?: UserSubscriptionMapEntity[]
}