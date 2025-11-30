import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm'

import { MissionTaskItem } from './mission-task-item.entity'
import { User } from './user.entity'

@Entity('user_mission_task_item')
@Unique(['userId', 'missionTaskItemId'])
export class UserMissionTaskItem {
  @PrimaryColumn('uuid')
  userId: string

  @PrimaryColumn('uuid')
  missionTaskItemId: string

  @Column({ type: 'bit', nullable: false, default: false })
  isCompleted: boolean

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User

  @ManyToOne(() => MissionTaskItem, (missionTaskItem) => missionTaskItem.userMissionTaskItems)
  @JoinColumn({ name: 'mission_task_item_id' })
  missionTaskItem: MissionTaskItem
}
