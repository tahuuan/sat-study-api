import { CreateProductDto, ProductResponseDto } from '../../core/dtos'
import { PageOptionsDto } from '../../core/dtos/page-options.dto'
import { ProductEntity } from '../../core/entities'

export interface IProductService {
  createProduct(product: CreateProductDto): Promise<ProductResponseDto>

  getProduct(id: string): Promise<ProductResponseDto>

  updateProduct(
    id: string,
    product: Partial<ProductEntity>
  ): Promise<ProductResponseDto>

  deleteProduct(id: string): Promise<boolean>

  getAllProductsByWarehouse(
    filters?: Partial<ProductEntity>,
    query?: PageOptionsDto,
    warehouseId?: string
  ): Promise<ProductResponseDto[]>

  getProductsByName(
    name: string,
    query?: PageOptionsDto
  ): Promise<ProductResponseDto[]>
}
