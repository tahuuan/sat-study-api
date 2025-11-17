import { EmployeeEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export type IEmployeeRepository = IGenericRepository<EmployeeEntity>
