import { DistinctProductResponseDto, PageOptionsDto } from '../dtos'
import { ProductEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export interface IProductRepository extends IGenericRepository<ProductEntity> {
  findProductByNameInWarehouse(
    name: string,
    quantity: number,
    warehouseId: string,
    isAvailable: boolean
  ): Promise<ProductEntity[]>

  getProductVersion(productId: string): Promise<number>

  updateProductWithVersion(
    productId: string,
    updateData: Partial<ProductEntity>,
    version: number
  ): Promise<boolean>

  findProductsByName(
    name: string,
    query?: PageOptionsDto
  ): Promise<ProductEntity[]>

  findDistinctProducts(
    filters: Partial<ProductEntity>,
    query?: PageOptionsDto,
    warehouseId?: string
  ): Promise<DistinctProductResponseDto[]>

  findProductsByWarehouse(
    filters: Partial<ProductEntity>,
    query?: PageOptionsDto,
    warehouseId?: string
  ): Promise<ProductEntity[]>
}
