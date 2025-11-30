import { UserEntity } from './user.entity'

export class UserSettingsEntity {
  userId: string
  mathScoreGoal?: number
  rdWtScoreGoal?: number
  nextTestDate?: Date

  user?: UserEntity
}