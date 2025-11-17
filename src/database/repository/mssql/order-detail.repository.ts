import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { OrderDetailEntity, ProductEntity } from '../../../core/entities'
import { IOrderDetailRepository } from '../../../core/repositories'
import { OrderDetail, Product } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class OrderDetailRepository
  extends GenericRepository<OrderDetailEntity>()
  implements IOrderDetailRepository
{
  protected repository = appDataSource.getRepository(OrderDetail)

  // TODO: Implement toDomainEntity
  protected toDomainEntity = (
    typeOrmEntity: OrderDetail
  ): OrderDetailEntity => {
    return {
      ...typeOrmEntity,
      product: typeOrmEntity.product as unknown as ProductEntity,
    }
  }

  async getOrderDetails(orderId: string): Promise<OrderDetailEntity[]> {
    const orderDetails = await this.repository
      .createQueryBuilder('orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .where('orderDetail.orderId = :orderId', { orderId })
      .getMany()
    return orderDetails.map(this.toDomainEntity)
  }
}
