import { Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ENUM_USER_ROLE, ENUM_USER_STATUS } from '../../../config/enums'

import { UserActivity } from './user-activity.entity'
import { UserSettings } from './user-settings.entity'
import { UserSubscriptionMap } from './user-subscription-map.entity'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string

  @Column({ type: 'varchar', enum: ENUM_USER_STATUS, nullable: true })
  status: ENUM_USER_STATUS

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string

  @Column({ type: 'varchar', enum: ENUM_USER_ROLE, nullable: true })
  role: ENUM_USER_ROLE

  @Column({ type: 'int', nullable: true })
  rdWtScore: number

  @Column({ type: 'int', nullable: true })
  mathScore: number

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string

  @Column({ type: 'int', nullable: true })
  totalScore: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  certification: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  specialty: string

  @OneToOne(() => UserSettings, (userSettings) => userSettings.user)
  userSettings?: UserSettings

  @OneToOne(() => UserActivity, (userActivity) => userActivity.user)
  userActivity?: UserActivity

  @OneToMany(() => UserSubscriptionMap, (userSubscriptionMap) => userSubscriptionMap.user)
  userSubscriptions?: UserSubscriptionMap[]
}
