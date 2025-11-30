import { BaseEntity } from './base.entity'
import { MissionTaskMissionItemMapEntity } from './mission-task-mission-item-map.entity'

export class MissionTaskEntity extends BaseEntity {
  title: string
  description?: string
  ableToIgnored: boolean
  phase?: string
  order?: number

  missionTaskMaps?: MissionTaskMissionItemMapEntity[]
}