import { ENUM_USER_ROLE, ENUM_USER_STATUS } from '../../config/enums'

import { UserActivityEntity } from './user-activity.entity'
import { UserSettingsEntity } from './user-settings.entity'
import { UserSubscriptionMapEntity } from './user-subscription-map.entity'

export class UserEntity {
  userId: string
  firstName: string
  lastName: string
  email: string
  status?: ENUM_USER_STATUS
  password?: string
  role?: ENUM_USER_ROLE
  rdWtScore?: number
  mathScore?: number
  phoneNumber?: string
  totalScore?: number
  certification?: string
  specialty?: string

  userSettings?: UserSettingsEntity
  userActivity?: UserActivityEntity
  userSubscriptions?: UserSubscriptionMapEntity[]
}