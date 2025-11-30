import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { TestTemplateModuleEntity } from '../../../core/entities'
import { TestTemplateModule } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class TestTemplateModuleRepository extends GenericRepository<TestTemplateModuleEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(TestTemplateModule)

    const toDomainEntity = (ormEntity: TestTemplateModule): TestTemplateModuleEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        difficulty: ormEntity.difficulty,
        name: ormEntity.name,
        type: ormEntity.type,
        totalQuestion: ormEntity.totalQuestion,
        timeLimitSecond: ormEntity.timeLimitSecond,
        testTemplateId: ormEntity.testTemplateId,
        chapterId: ormEntity.chapterId,
        testTemplateQuestions: ormEntity.testTemplateQuestions?.map((ttq) => ({
          id: ttq.id,
          createdAt: ttq.createdAt,
          updatedAt: ttq.updatedAt,
          deletedAt: ttq.deletedAt,
          testTemplateModuleId: ttq.testTemplateModuleId,
          questionId: ttq.questionId,
          order: ttq.order,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
