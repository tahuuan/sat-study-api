import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { PageOptionsDto } from '../../../core/dtos'
import { SupplierEntity } from '../../../core/entities'
import { ISupplierRepository } from '../../../core/repositories'
import { Supplier } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class SupplierRepository
  extends GenericRepository<SupplierEntity>()
  implements ISupplierRepository
{
  protected repository = appDataSource.getRepository(Supplier)
  protected toDomainEntity = (typeOrmEntity: Supplier): SupplierEntity => ({
    ...typeOrmEntity,
    supplierProducts: [],
  })

  async findSuppliersByName(
    name: string,
    query?: PageOptionsDto
  ): Promise<SupplierEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('supplier')
      .where('supplier.name LIKE :name COLLATE SQL_Latin1_General_CP1_CI_AS', {
        name: `%${name}%`,
      })
      .orderBy(query?.sort ?? 'supplier.name', query?.sortDirection ?? 'ASC')
      .take(query?.take ?? 10)
      .skip(query?.skip ?? 0)

    const suppliers = await queryBuilder.getMany()
    return suppliers.map(this.toDomainEntity)
  }
}
