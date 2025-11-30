import { ENUM_SESSION_REFERENCE_TYPE, ENUM_TEST_STATUS, ENUM_TEST_TYPE } from '../../config/enums/session.enum'

import { BaseEntity } from './base.entity'
import { TestSessionQuestionEntity } from './test-session-question.entity'
import { UserEntity } from './user.entity'

export class TestSessionEntity extends BaseEntity {
  userId: string
  testType?: ENUM_TEST_TYPE
  testName?: string
  totalQuestion?: number
  timeLimitSecond?: number
  status?: ENUM_TEST_STATUS
  currentQuestionIndex?: number
  numberQuestionAnswered?: number
  startedAt?: Date
  pausedAt?: Date
  completedAt?: Date
  referenceType?: ENUM_SESSION_REFERENCE_TYPE
  referenceId?: string
  numberQuestionCorrect?: number

  user?: UserEntity
  testSessionQuestions?: TestSessionQuestionEntity[]
}