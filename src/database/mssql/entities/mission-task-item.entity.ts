import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { ENUM_MISSION_TASK_ITEM_TYPE } from '../../../config/enums'

import { BaseEntity } from './base.entity'
import { Chapter } from './chapter.entity'
import { MissionTaskMissionItemMap } from './mission-task-mission-item-map.entity'
import { UserMissionTaskItem } from './user-mission-task-item.entity'

@Entity('mission_task_item')
export class MissionTaskItem extends BaseEntity {
  @Column({ type: 'bit', nullable: false, default: false })
  ableToIgnored: boolean

  @Column({ type: 'varchar', enum: ENUM_MISSION_TASK_ITEM_TYPE, nullable: false })
  type: ENUM_MISSION_TASK_ITEM_TYPE

  @Column({ type: 'text', nullable: true })
  content: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string

  @Column({ type: 'uuid', nullable: true })
  chapterId?: string

  @ManyToOne(() => Chapter, (chapter) => chapter.missionTaskItems)
  @JoinColumn({ name: 'chapter_id' })
  chapter?: Chapter

  @OneToMany(() => MissionTaskMissionItemMap, (map) => map.missionTaskItem)
  missionTaskMaps?: MissionTaskMissionItemMap[]

  @OneToMany(() => UserMissionTaskItem, (userMissionTaskItem) => userMissionTaskItem.missionTaskItem)
  userMissionTaskItems?: UserMissionTaskItem[]
}
