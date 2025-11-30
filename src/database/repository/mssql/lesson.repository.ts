import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { LessonEntity } from '../../../core/entities'
import { Lesson } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class LessonRepository extends GenericRepository<LessonEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(Lesson)

    const toDomainEntity = (ormEntity: Lesson): LessonEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        title: ormEntity.title,
        subTitle: ormEntity.subTitle,
        previousLessonId: ormEntity.previousLessonId,
        nextLessonId: ormEntity.nextLessonId,
        chapterId: ormEntity.chapterId,
        lessonContents: ormEntity.lessonContents?.map((content) => ({
          id: content.id,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
          deletedAt: content.deletedAt,
          content: content.content,
          type: content.type,
          contentParentId: content.contentParentId,
          lessonId: content.lessonId,
          order: content.order,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
