import { BaseEntity } from './base.entity'
import { QuestionEntity } from './question.entity'
import { TestSessionEntity } from './test-session.entity'

export class TestSessionQuestionEntity extends BaseEntity {
  questionId: string
  answeredAt?: Date
  timeSpent?: number
  isCorrect?: boolean
  order?: number
  isAnswered: boolean
  isFlagged: boolean
  answer?: string

  testSession?: TestSessionEntity
  question?: QuestionEntity
}