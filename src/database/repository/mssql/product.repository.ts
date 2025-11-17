import { plainToInstance } from 'class-transformer'
import { injectable } from 'tsyringe'
import { Equal, FindOptionsWhere, Like } from 'typeorm'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { DistinctProductResponseDto, PageOptionsDto } from '../../../core/dtos'
import { ProductEntity } from '../../../core/entities'
import { IProductRepository } from '../../../core/repositories'
import { Product } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class ProductRepository
  extends GenericRepository<ProductEntity>()
  implements IProductRepository
{
  protected repository = appDataSource.getRepository(Product)

  protected toDomainEntity = (typeOrmEntity: Product): ProductEntity => {
    return plainToInstance(ProductEntity, typeOrmEntity)
  }

  async findProductByNameInWarehouse(
    name: string,
    quantity: number,
    warehouseId: string,
    isAvailable: boolean
  ): Promise<ProductEntity[]> {
    const query = this.repository
      .createQueryBuilder('product')
      .where('product.name = :name', { name })
      .andWhere('product.isAvailable = :isAvailable', { isAvailable })
      .leftJoinAndSelect('product.stores', 'stores')
      .andWhere('stores.warehouseId = :warehouseId', { warehouseId })
      .orderBy('product.createdAt', 'ASC')
      .take(quantity)

    const products = await query.getMany()

    return products.map(product => this.toDomainEntity(product))
  }

  async getProductVersion(productId: string): Promise<number> {
    const product = await this.repository.findOne({
      where: { id: productId },
    })
    return product?.version ?? 0
  }

  async updateProductWithVersion(
    productId: string,
    updateData: Partial<ProductEntity>,
    version: number
  ): Promise<boolean> {
    const result = await this.repository.update(
      {
        id: productId,
        version: Equal(version),
      },
      {
        ...updateData,
        version: version + 1,
      }
    )

    return (result.affected ?? 0) > 0
  }

  async findProductsByName(
    name: string,
    query?: PageOptionsDto
  ): Promise<ProductEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .where('product.name LIKE :name COLLATE SQL_Latin1_General_CP1_CI_AS', {
        name: `%${name}%`,
      })
      .orderBy(query?.sort ?? 'product.name', query?.sortDirection ?? 'ASC')
      .take(query?.take ?? 10)
      .skip(query?.skip ?? 0)

    const products = await queryBuilder.getMany()
    return products.map(this.toDomainEntity)
  }

  async findDistinctProducts(
    filters: Partial<ProductEntity> = {},
    query?: PageOptionsDto,
    warehouseId?: string
  ): Promise<DistinctProductResponseDto[]> {
    const qb = this.repository
      .createQueryBuilder('product')
      .leftJoin('product.stores', 'store')
      .select([
        'product.name AS name',
        'COUNT(*) AS count',
        'MIN(product.id) AS id',
        'MIN(product.price) AS price',
        'MIN(product.category) AS category',
      ])
      .groupBy('product.name')
      .orderBy(query?.sort ?? 'product.name', query?.sortDirection ?? 'ASC')
      .take(query?.take ?? 10)
      .skip(query?.skip ?? 0)

    if (filters.name) {
      qb.andWhere(
        'product.name LIKE :name COLLATE SQL_Latin1_General_CP1_CI_AS',
        { name: `%${filters.name}%` }
      )
    }
    if (filters.category) {
      qb.andWhere('product.category = :category', {
        category: filters.category,
      })
    }
    if (warehouseId) {
      qb.andWhere('store.warehouseId = :warehouseId', { warehouseId })
    }
    if (filters.isAvailable !== undefined) {
      qb.andWhere('product.isAvailable = :isAvailable', {
        isAvailable: filters.isAvailable,
      })
    }

    if (query?.sort && ['price', 'name'].includes(query.sort)) {
      qb.orderBy(`MIN(product.${query.sort})`, query.sortDirection ?? 'ASC')
    }

    return await qb.getRawMany()
  }

  async findProductsByWarehouse(
    filters: Partial<ProductEntity> = {},
    pageOptions?: PageOptionsDto,
    warehouseId?: string
  ): Promise<ProductEntity[]> {
    const where: FindOptionsWhere<Product> & {
      stores?: { warehouseId: string }[]
    } = { ...filters }

    if (filters.name) {
      where.name = Like(`%${filters.name}%`)
    }
    if (warehouseId) {
      where.stores = [{ warehouseId }]
    }
    const ormEntities = await this.repository.find({
      where,
      take: pageOptions?.take ?? 100,
      skip: pageOptions?.skip ?? 0,
      order: {
        ...(pageOptions?.sort
          ? { [pageOptions.sort]: pageOptions.sortDirection ?? 'ASC' }
          : {}),
      },
      relations: ['stores'],
    })
    return ormEntities.map(this.toDomainEntity)
  }
}
