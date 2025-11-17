import { SupplierProductEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export interface ISupplierProductRepository extends IGenericRepository<SupplierProductEntity> {
  getSupplierProductById(id: string): Promise<SupplierProductEntity | null>
}
