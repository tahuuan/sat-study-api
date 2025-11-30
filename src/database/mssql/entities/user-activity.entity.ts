import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import { User } from './user.entity'

@Entity('user_activity')
export class UserActivity {
  @PrimaryColumn('uuid')
  userId: string

  @Column({ type: 'date', nullable: true })
  recentDate: Date

  @Column({ type: 'int', nullable: true })
  activeSecond: number

  @Column({ type: 'int', nullable: true })
  streak: number

  @OneToOne(() => User, (user) => user.userActivity)
  @JoinColumn({ name: 'user_id' })
  user: User
}
