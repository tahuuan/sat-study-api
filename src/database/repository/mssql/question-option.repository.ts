import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { QuestionOptionEntity } from '../../../core/entities'
import { QuestionOption } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class QuestionOptionRepository extends GenericRepository<QuestionOptionEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(QuestionOption)

    const toDomainEntity = (ormEntity: QuestionOption): QuestionOptionEntity => {
      return {
        questionId: ormEntity.questionId,
        value: ormEntity.value,
        nameOption: ormEntity.nameOption,
      }
    }

    super(repository, toDomainEntity)
  }
}
