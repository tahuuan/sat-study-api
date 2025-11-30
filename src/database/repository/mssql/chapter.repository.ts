import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { ChapterEntity } from '../../../core/entities'
import { Chapter } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class ChapterRepository extends GenericRepository<ChapterEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(Chapter)

    const toDomainEntity = (ormEntity: Chapter): ChapterEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        title: ormEntity.title,
        description: ormEntity.description,
        type: ormEntity.type,
        order: ormEntity.order,
        lessons: ormEntity.lessons?.map((lesson) => ({
          id: lesson.id,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
          deletedAt: lesson.deletedAt,
          title: lesson.title,
          subTitle: lesson.subTitle,
          previousLessonId: lesson.previousLessonId,
          nextLessonId: lesson.nextLessonId,
          chapterId: lesson.chapterId,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
