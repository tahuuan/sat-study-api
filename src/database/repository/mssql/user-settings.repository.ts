import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { UserSettingsEntity } from '../../../core/entities'
import { UserSettings } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class UserSettingsRepository extends GenericRepository<UserSettingsEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(UserSettings)

    const toDomainEntity = (ormEntity: UserSettings): UserSettingsEntity => {
      return {
        userId: ormEntity.userId,
        mathScoreGoal: ormEntity.mathScoreGoal,
        rdWtScoreGoal: ormEntity.rdWtScoreGoal,
        nextTestDate: ormEntity.nextTestDate,
      }
    }

    super(repository, toDomainEntity)
  }
}
