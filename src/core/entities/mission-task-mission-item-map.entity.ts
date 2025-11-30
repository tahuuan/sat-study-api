import { MissionTaskItemEntity } from './mission-task-item.entity'
import { MissionTaskEntity } from './mission-task.entity'

export class MissionTaskMissionItemMapEntity {
  missionTaskId: string
  missionTaskItemId: string
  order?: number

  missionTask?: MissionTaskEntity
  missionTaskItem?: MissionTaskItemEntity
}