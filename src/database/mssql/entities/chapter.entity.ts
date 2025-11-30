import { Column, Entity, OneToMany } from 'typeorm'

import { ENUM_TYPE } from '../../../config/enums'

import { BaseEntity } from './base.entity'
import { Lesson } from './lesson.entity'
import { MissionTaskItem } from './mission-task-item.entity'
import { TestTemplateModule } from './test-template-module.entity'

@Entity('chapter')
export class Chapter extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'varchar', enum: ENUM_TYPE, nullable: true })
  type: ENUM_TYPE

  @Column({ type: 'int', nullable: true })
  order: number

  @OneToMany(() => Lesson, (lesson) => lesson.chapter)
  lessons?: Lesson[]

  @OneToMany(() => MissionTaskItem, (missionTaskItem) => missionTaskItem.chapter)
  missionTaskItems?: MissionTaskItem[]

  @OneToMany(() => TestTemplateModule, (testTemplateModule) => testTemplateModule.chapter)
  testTemplateModules?: TestTemplateModule[]
}
