import { plainToInstance } from 'class-transformer'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { SupplierProductEntity } from '../../../core/entities'
import { ISupplierProductRepository } from '../../../core/repositories'
import { SupplierProduct } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

export class SupplierProductRepository
  extends GenericRepository<SupplierProductEntity>()
  implements ISupplierProductRepository
{
  protected repository = appDataSource.getRepository(SupplierProduct)

  protected toDomainEntity = (
    typeOrmEntity: SupplierProduct
  ): SupplierProductEntity => {
    return plainToInstance(SupplierProductEntity, typeOrmEntity)
  }

  async getSupplierProductById(
    productId: string
  ): Promise<SupplierProductEntity | null> {
    const supplierProduct = await this.repository
      .createQueryBuilder('supplierProduct')
      .leftJoinAndSelect('supplierProduct.supplier', 'supplier')
      .where('supplierProduct.productId = :productId', { productId })
      .getOne()

    return supplierProduct ? this.toDomainEntity(supplierProduct) : null
  }
}
