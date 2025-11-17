import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { DeliveryPartnerEntity } from '../../../core/entities'
import { IDeliveryPartnerRepository } from '../../../core/repositories'
import { DeliveryPartner } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class DeliveryPartnerRepository
  extends GenericRepository<DeliveryPartnerEntity>()
  implements IDeliveryPartnerRepository
{
  constructor() {
    const repository = appDataSource.getRepository(DeliveryPartner)

    // TODO: Implement toDomainEntity
    const toDomainEntity = (
      typeOrmEntity: DeliveryPartner
    ): DeliveryPartnerEntity => {
      return {
        ...typeOrmEntity,
        shipments: [],
      }
    }

    super(repository, toDomainEntity)
  }
}
