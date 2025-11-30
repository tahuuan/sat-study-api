import { UserEntity } from './user.entity'

export class UserActivityEntity {
  userId: string
  recentDate?: Date
  activeSecond?: number
  streak?: number

  user?: UserEntity
}