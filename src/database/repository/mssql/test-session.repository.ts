import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { TestSessionEntity } from '../../../core/entities'
import { TestSession } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class TestSessionRepository extends GenericRepository<TestSessionEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(TestSession)

    const toDomainEntity = (ormEntity: TestSession): TestSessionEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        userId: ormEntity.userId,
        testType: ormEntity.testType,
        testName: ormEntity.testName,
        totalQuestion: ormEntity.totalQuestion,
        timeLimitSecond: ormEntity.timeLimitSecond,
        status: ormEntity.status,
        currentQuestionIndex: ormEntity.currentQuestionIndex,
        numberQuestionAnswered: ormEntity.numberQuestionAnswered,
        startedAt: ormEntity.startedAt,
        pausedAt: ormEntity.pausedAt,
        completedAt: ormEntity.completedAt,
        referenceType: ormEntity.referenceType,
        referenceId: ormEntity.referenceId,
        numberQuestionCorrect: ormEntity.numberQuestionCorrect,
        testSessionQuestions: ormEntity.testSessionQuestions?.map((tsq) => ({
          id: tsq.id,
          createdAt: tsq.createdAt,
          updatedAt: tsq.updatedAt,
          deletedAt: tsq.deletedAt,
          questionId: tsq.questionId,
          answeredAt: tsq.answeredAt,
          timeSpent: tsq.timeSpent,
          isCorrect: tsq.isCorrect,
          order: tsq.order,
          isAnswered: tsq.isAnswered,
          isFlagged: tsq.isFlagged,
          answer: tsq.answer,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
