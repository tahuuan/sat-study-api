import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { TestTemplateQuestionEntity } from '../../../core/entities'
import { TestTemplateQuestion } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class TestTemplateQuestionRepository extends GenericRepository<TestTemplateQuestionEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(TestTemplateQuestion)

    const toDomainEntity = (ormEntity: TestTemplateQuestion): TestTemplateQuestionEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        testTemplateModuleId: ormEntity.testTemplateModuleId,
        questionId: ormEntity.questionId,
        order: ormEntity.order,
      }
    }

    super(repository, toDomainEntity)
  }
}
