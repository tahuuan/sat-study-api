import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { MissionTaskEntity } from '../../../core/entities'
import { MissionTask } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class MissionTaskRepository extends GenericRepository<MissionTaskEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(MissionTask)

    const toDomainEntity = (ormEntity: MissionTask): MissionTaskEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        title: ormEntity.title,
        description: ormEntity.description,
        ableToIgnored: ormEntity.ableToIgnored,
        phase: ormEntity.phase,
        order: ormEntity.order,
        missionTaskMaps: ormEntity.missionTaskMaps?.map((map) => ({
          missionTaskId: map.missionTaskId,
          missionTaskItemId: map.missionTaskItemId,
          order: map.order,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
