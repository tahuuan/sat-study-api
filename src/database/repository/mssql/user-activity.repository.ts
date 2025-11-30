import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { UserActivityEntity } from '../../../core/entities'
import { UserActivity } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class UserActivityRepository extends GenericRepository<UserActivityEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(UserActivity)

    const toDomainEntity = (ormEntity: UserActivity): UserActivityEntity => {
      return {
        userId: ormEntity.userId,
        recentDate: ormEntity.recentDate,
        activeSecond: ormEntity.activeSecond,
        streak: ormEntity.streak,
      }
    }

    super(repository, toDomainEntity)
  }
}
