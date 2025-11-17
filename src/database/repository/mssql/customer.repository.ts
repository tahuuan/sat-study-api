import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { CustomerEntity } from '../../../core/entities'
import { ICustomerRepository } from '../../../core/repositories'
import { Customer } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class CustomerRepository
  extends GenericRepository<CustomerEntity>()
  implements ICustomerRepository {
  constructor() {
    const repository = appDataSource.getRepository(Customer)

    // TODO: Implement toDomainEntity
    const toDomainEntity = (typeOrmEntity: Customer): CustomerEntity => {
      return typeOrmEntity
    }

    super(repository, toDomainEntity)
  }
}
