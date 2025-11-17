import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { ShipmentEntity } from '../../../core/entities'
import { IShipmentRepository } from '../../../core/repositories'
import { Shipment } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class ShipmentRepository
  extends GenericRepository<ShipmentEntity>()
  implements IShipmentRepository
{
  constructor() {
    const repository = appDataSource.getRepository(Shipment)

    // TODO: Implement toDomainEntity
    const toDomainEntity = (typeOrmEntity: Shipment): ShipmentEntity => {
      return typeOrmEntity
    }

    super(repository, toDomainEntity)
  }
}
