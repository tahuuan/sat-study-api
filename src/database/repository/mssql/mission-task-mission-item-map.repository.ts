import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { MissionTaskMissionItemMapEntity } from '../../../core/entities'
import { MissionTaskMissionItemMap } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class MissionTaskMissionItemMapRepository extends GenericRepository<MissionTaskMissionItemMapEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(MissionTaskMissionItemMap)

    const toDomainEntity = (
      ormEntity: MissionTaskMissionItemMap
    ): MissionTaskMissionItemMapEntity => {
      return {
        missionTaskId: ormEntity.missionTaskId,
        missionTaskItemId: ormEntity.missionTaskItemId,
        order: ormEntity.order,
      }
    }

    super(repository, toDomainEntity)
  }
}
