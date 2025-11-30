import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Question } from './question.entity'
import { TestSession } from './test-session.entity'

@Entity('test_session_question')
export class TestSessionQuestion extends BaseEntity {
  @Column('uuid')
  questionId: string

  @Column({ type: 'datetime2', nullable: true })
  answeredAt: Date

  @Column({ type: 'int', nullable: true })
  timeSpent: number

  @Column({ type: 'bit', nullable: true })
  isCorrect: boolean

  @Column({ type: 'int', nullable: true })
  order: number

  @Column({ type: 'bit', nullable: false, default: false })
  isAnswered: boolean

  @Column({ type: 'bit', nullable: false, default: false })
  isFlagged: boolean

  @Column({ type: 'varchar', length: 255, nullable: true })
  answer: string

  @ManyToOne(() => TestSession, (testSession) => testSession.testSessionQuestions)
  @JoinColumn({ name: 'test_session_id' })
  testSession?: TestSession

  @ManyToOne(() => Question, (question) => question.testSessionQuestions)
  @JoinColumn({ name: 'question_id' })
  question?: Question
}
