import { StoreEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export interface IStoreRepository extends IGenericRepository<StoreEntity> {
  getStoreById(id: string): Promise<StoreEntity | null>
}
