import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { QuestionEntity } from '../../../core/entities'
import { Question } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class QuestionRepository extends GenericRepository<QuestionEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(Question)

    const toDomainEntity = (ormEntity: Question): QuestionEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        status: ormEntity.status,
        questionText: ormEntity.questionText,
        correctAnswer: ormEntity.correctAnswer,
        difficulty: ormEntity.difficulty,
        explanation: ormEntity.explanation,
        kind: ormEntity.kind,
        type: ormEntity.type,
        tutorId: ormEntity.tutorId,
        questionOptions: ormEntity.questionOptions?.map((option) => ({
          questionId: option.questionId,
          value: option.value,
          nameOption: option.nameOption,
        })),
        questionImages: ormEntity.questionImages?.map((qi) => ({
          imageId: qi.imageId,
          questionId: qi.questionId,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
