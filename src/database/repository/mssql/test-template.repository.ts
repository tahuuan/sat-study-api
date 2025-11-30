import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { TestTemplateEntity } from '../../../core/entities'
import { TestTemplate } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class TestTemplateRepository extends GenericRepository<TestTemplateEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(TestTemplate)

    const toDomainEntity = (ormEntity: TestTemplate): TestTemplateEntity => {
      return {
        testTemplateId: ormEntity.testTemplateId,
        isPublic: ormEntity.isPublic,
        name: ormEntity.name,
        description: ormEntity.description,
        topic: ormEntity.topic,
        testType: ormEntity.testType,
        contentTier: ormEntity.contentTier,
        testTemplateModules: ormEntity.testTemplateModules.map((module) => ({
          id: module.id,
          createdAt: module.createdAt,
          updatedAt: module.updatedAt,
          deletedAt: module.deletedAt,
          difficulty: module.difficulty,
          name: module.name,
          type: module.type,
          totalQuestion: module.totalQuestion,
          timeLimitSecond: module.timeLimitSecond,
          testTemplateId: module.testTemplateId,
          chapterId: module.chapterId,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
