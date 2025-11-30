import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { TestSessionQuestionEntity } from '../../../core/entities'
import { TestSessionQuestion } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class TestSessionQuestionRepository extends GenericRepository<TestSessionQuestionEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(TestSessionQuestion)

    const toDomainEntity = (ormEntity: TestSessionQuestion): TestSessionQuestionEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        questionId: ormEntity.questionId,
        answeredAt: ormEntity.answeredAt,
        timeSpent: ormEntity.timeSpent,
        isCorrect: ormEntity.isCorrect,
        order: ormEntity.order,
        isAnswered: ormEntity.isAnswered,
        isFlagged: ormEntity.isFlagged,
        answer: ormEntity.answer,
      }
    }

    super(repository, toDomainEntity)
  }
}
