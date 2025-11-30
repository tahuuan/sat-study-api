import { ENUM_TYPE } from '../../config/enums'

import { BaseEntity } from './base.entity'
import { LessonEntity } from './lesson.entity'
import { MissionTaskItemEntity } from './mission-task-item.entity'
import { TestTemplateModuleEntity } from './test-template-module.entity'

export class ChapterEntity extends BaseEntity {
  title: string
  description?: string
  type?: ENUM_TYPE
  order?: number

  lessons?: LessonEntity[]
  missionTaskItems?: MissionTaskItemEntity[]
  testTemplateModules?: TestTemplateModuleEntity[]
}