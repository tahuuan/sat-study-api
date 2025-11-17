import { OrderDetailEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export interface IOrderDetailRepository extends IGenericRepository<OrderDetailEntity> {
  getOrderDetails(orderId: string): Promise<OrderDetailEntity[]>
}
