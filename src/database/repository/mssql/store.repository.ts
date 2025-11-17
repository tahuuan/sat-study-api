import { plainToInstance } from 'class-transformer'
import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { StoreEntity } from '../../../core/entities'
import { IStoreRepository } from '../../../core/repositories'
import { Store } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'


@injectable()
export class StoreRepository
  extends GenericRepository<StoreEntity>()
  implements IStoreRepository
{
  protected repository = appDataSource.getRepository(Store)

  protected toDomainEntity = (typeOrmEntity: Store): StoreEntity => {
    return plainToInstance(StoreEntity, typeOrmEntity)
  }

  async getStoreById(productId: string): Promise<StoreEntity | null> {
    const store = await this.repository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.warehouse', 'warehouse')
      .where('store.productId = :productId', { productId })
      .getOne()

    return store ? this.toDomainEntity(store) : null
  }
}
