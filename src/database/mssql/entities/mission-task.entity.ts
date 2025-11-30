import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntity } from './base.entity'
import { MissionTaskMissionItemMap } from './mission-task-mission-item-map.entity'

@Entity('mission_task')
export class MissionTask extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'bit', nullable: false, default: false })
  ableToIgnored: boolean

  @Column({ type: 'varchar', length: 100, nullable: true })
  phase: string

  @Column({ type: 'int', nullable: true })
  order: number

  @OneToMany(() => MissionTaskMissionItemMap, (map) => map.missionTask)
  missionTaskMaps?: MissionTaskMissionItemMap[]
}
