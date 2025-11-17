import { OrderEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export type IOrderRepository = IGenericRepository<OrderEntity>
