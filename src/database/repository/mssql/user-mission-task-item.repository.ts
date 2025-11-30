import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { UserMissionTaskItemEntity } from '../../../core/entities'
import { UserMissionTaskItem } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class UserMissionTaskItemRepository extends GenericRepository<UserMissionTaskItemEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(UserMissionTaskItem)

    const toDomainEntity = (ormEntity: UserMissionTaskItem): UserMissionTaskItemEntity => {
      return {
        userId: ormEntity.userId,
        missionTaskItemId: ormEntity.missionTaskItemId,
        isCompleted: ormEntity.isCompleted,
      }
    }

    super(repository, toDomainEntity)
  }
}
