import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { OrderEntity } from '../../../core/entities'
import { IOrderRepository } from '../../../core/repositories'
import { Order } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class OrderRepository
  extends GenericRepository<OrderEntity>()
  implements IOrderRepository
{
  constructor() {
    const repository = appDataSource.getRepository(Order)

    // TODO: Implement toDomainEntity
    const toDomainEntity = (typeOrmEntity: Order): OrderEntity => {
      return {
        ...typeOrmEntity,
        orderDetails: [],
        shipment: undefined,
      }
    }

    super(repository, toDomainEntity)
  }
}
