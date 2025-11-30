import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { ENUM_SESSION_REFERENCE_TYPE, ENUM_TEST_STATUS, ENUM_TEST_TYPE } from '../../../config/enums/session.enum'

import { BaseEntity } from './base.entity'
import { TestSessionQuestion } from './test-session-question.entity'
import { User } from './user.entity'

@Entity('test_session')
@Check(`(started_at IS NULL OR paused_at IS NULL OR started_at <= paused_at) AND (started_at IS NULL OR completed_at IS NULL OR started_at <= completed_at) AND (paused_at IS NULL OR completed_at IS NULL OR paused_at <= completed_at)`)
export class TestSession extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string

  @Column({ type: 'varchar', enum: ENUM_TEST_TYPE, nullable: true })
  testType: ENUM_TEST_TYPE

  @Column({ type: 'varchar', length: 255, nullable: true })
  testName: string

  @Column({ type: 'int', nullable: true })
  totalQuestion: number

  @Column({ type: 'int', nullable: true })
  timeLimitSecond: number

  @Column({ type: 'varchar', enum: ENUM_TEST_STATUS, nullable: true })
  status: ENUM_TEST_STATUS

  @Column({ type: 'int', nullable: true })
  currentQuestionIndex: number

  @Column({ type: 'int', nullable: true })
  numberQuestionAnswered: number

  @Column({ type: 'datetime2', nullable: true })
  startedAt: Date

  @Column({ type: 'datetime2', nullable: true })
  pausedAt: Date

  @Column({ type: 'datetime2', nullable: true })
  completedAt: Date

  @Column({ type: 'varchar', enum: ENUM_SESSION_REFERENCE_TYPE, nullable: true })
  referenceType: ENUM_SESSION_REFERENCE_TYPE

  @Column({ type: 'uuid', nullable: true })
  referenceId: string

  @Column({ type: 'int', nullable: true })
  numberQuestionCorrect: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User

  @OneToMany(() => TestSessionQuestion, (testSessionQuestion) => testSessionQuestion.testSession)
  testSessionQuestions?: TestSessionQuestion[]
}
