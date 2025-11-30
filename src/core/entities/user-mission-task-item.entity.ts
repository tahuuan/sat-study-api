import { MissionTaskItemEntity } from './mission-task-item.entity'
import { UserEntity } from './user.entity'

export class UserMissionTaskItemEntity {
  userId: string
  missionTaskItemId: string
  isCompleted: boolean

  user?: UserEntity
  missionTaskItem?: MissionTaskItemEntity
}