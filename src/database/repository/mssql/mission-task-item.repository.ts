import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { MissionTaskItemEntity } from '../../../core/entities'
import { MissionTaskItem } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class MissionTaskItemRepository extends GenericRepository<MissionTaskItemEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(MissionTaskItem)

    const toDomainEntity = (ormEntity: MissionTaskItem): MissionTaskItemEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        ableToIgnored: ormEntity.ableToIgnored,
        type: ormEntity.type,
        content: ormEntity.content,
        title: ormEntity.title,
        chapterId: ormEntity.chapterId,
      }
    }

    super(repository, toDomainEntity)
  }
}
