import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm'

import { MissionTaskItem } from './mission-task-item.entity'
import { MissionTask } from './mission-task.entity'

@Entity('mission_task_mission_item_map')
@Unique(['missionTaskId', 'missionTaskItemId'])
export class MissionTaskMissionItemMap {
  @PrimaryColumn('uuid')
  missionTaskId: string

  @PrimaryColumn('uuid')
  missionTaskItemId: string

  @Column({ type: 'int', nullable: true })
  order: number

  @ManyToOne(() => MissionTask, (missionTask) => missionTask.missionTaskMaps)
  @JoinColumn({ name: 'missionTask_id' })
  missionTask?: MissionTask

  @ManyToOne(() => MissionTaskItem, (missionTaskItem) => missionTaskItem.missionTaskMaps)
  @JoinColumn({ name: 'missionTaskItem_id' })
  missionTaskItem?: MissionTaskItem
}
