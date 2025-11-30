import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { QuestionImageEntity } from '../../../core/entities'
import { QuestionImage } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class QuestionImageRepository extends GenericRepository<QuestionImageEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(QuestionImage)

    const toDomainEntity = (ormEntity: QuestionImage): QuestionImageEntity => {
      return {
        imageId: ormEntity.imageId,
        questionId: ormEntity.questionId,
      }
    }

    super(repository, toDomainEntity)
  }
}
