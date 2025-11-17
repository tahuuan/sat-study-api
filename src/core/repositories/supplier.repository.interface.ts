import { PageOptionsDto } from '../dtos'
import { SupplierEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export interface ISupplierRepository
  extends IGenericRepository<SupplierEntity> {
  findSuppliersByName(
    name: string,
    query?: PageOptionsDto
  ): Promise<SupplierEntity[]>
}
