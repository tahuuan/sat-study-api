import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { LessonContentEntity } from '../../../core/entities'
import { LessonContent } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class LessonContentRepository extends GenericRepository<LessonContentEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(LessonContent)

    const toDomainEntity = (ormEntity: LessonContent): LessonContentEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        content: ormEntity.content,
        type: ormEntity.type,
        contentParentId: ormEntity.contentParentId,
        lessonId: ormEntity.lessonId,
        order: ormEntity.order,
      }
    }

    super(repository, toDomainEntity)
  }
}
