import { CustomerEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export type ICustomerRepository = IGenericRepository<CustomerEntity>
