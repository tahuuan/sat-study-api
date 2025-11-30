import { ENUM_MISSION_TASK_ITEM_TYPE } from '../../config/enums'

import { BaseEntity } from './base.entity'
import { ChapterEntity } from './chapter.entity'
import { MissionTaskMissionItemMapEntity } from './mission-task-mission-item-map.entity'
import { UserMissionTaskItemEntity } from './user-mission-task-item.entity'

export class MissionTaskItemEntity extends BaseEntity {
  ableToIgnored: boolean
  type: ENUM_MISSION_TASK_ITEM_TYPE
  content?: string
  title?: string
  chapterId?: string

  chapter?: ChapterEntity
  missionTaskMaps?: MissionTaskMissionItemMapEntity[]
  userMissionTaskItems?: UserMissionTaskItemEntity[]
}