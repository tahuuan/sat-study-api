import { Check, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import { User } from './user.entity'

@Entity('user_settings')
@Check(`(math_score_goal IS NULL OR (math_score_goal >= 200 AND math_score_goal <= 800))`)
@Check(`(rd_wt_score_goal IS NULL OR (rd_wt_score_goal >= 200 AND rd_wt_score_goal <= 800))`)
export class UserSettings {
  @PrimaryColumn('uuid')
  userId: string

  @Column({ type: 'int', nullable: true })
  mathScoreGoal: number

  @Column({ type: 'int', nullable: true })
  rdWtScoreGoal: number

  @Column({ type: 'date', nullable: true })
  nextTestDate: Date

  @OneToOne(() => User, (user) => user.userSettings)
  @JoinColumn({ name: 'user_id' })
  user?: User
}