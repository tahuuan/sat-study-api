import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { EmployeeEntity } from '../../../core/entities'
import { IEmployeeRepository } from '../../../core/repositories'
import { Employee } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class EmployeeRepository
  extends GenericRepository<EmployeeEntity>()
  implements IEmployeeRepository
{
  constructor() {
    const repository = appDataSource.getRepository(Employee)

    // TODO: Implement toDomainEntity
    const toDomainEntity = (typeOrmEntity: Employee): EmployeeEntity => {
      return {
        ...typeOrmEntity,
        warehouse: undefined,
      }
    }

    super(repository, toDomainEntity)
  }
}
