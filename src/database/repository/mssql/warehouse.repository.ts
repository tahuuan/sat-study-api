import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { WarehouseEntity } from '../../../core/entities'
import { IWarehouseRepository } from '../../../core/repositories'
import { Warehouse } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class WarehouseRepository
  extends GenericRepository<WarehouseEntity>()
  implements IWarehouseRepository
{
  constructor() {
    const repository = appDataSource.getRepository(Warehouse)

    // TODO: Implement toDomainEntity
    const toDomainEntity = (typeOrmEntity: Warehouse): WarehouseEntity => {
      return {
        ...typeOrmEntity,
        stores: []
      }
    }

    super(repository, toDomainEntity)
  }
}
