import { plainToInstance } from 'class-transformer'
import { inject, injectable } from 'tsyringe'

import { appDataSource } from '../config/database/mssql/db.config'
import { REPOSITORY_INJECTION_TOKEN } from '../config/enums'
import {
  CreateProductDto,
  DistinctProductResponseDto,
  PageOptionsDto,
  ProductResponseDto,
  UpdateProductDto,
} from '../core/dtos'
import { ProductEntity } from '../core/entities'
import type {
  IProductRepository,
  IStoreRepository,
  ISupplierProductRepository,
  IWarehouseRepository,
} from '../core/repositories'

import { IProductService } from './adapters/product.interface'

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject(REPOSITORY_INJECTION_TOKEN.PRODUCT)
    private readonly productRepository: IProductRepository,

    @inject(REPOSITORY_INJECTION_TOKEN.STORE)
    private readonly storeRepository: IStoreRepository,

    @inject(REPOSITORY_INJECTION_TOKEN.WAREHOUSE)
    private readonly warehouseRepository: IWarehouseRepository,

    @inject(REPOSITORY_INJECTION_TOKEN.SUPPLIER_PRODUCT)
    private readonly supplierProductRepository: ISupplierProductRepository
  ) {}

  async createProduct(product: CreateProductDto): Promise<ProductResponseDto> {
    try {
      const queryRunner = appDataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        const createdProduct = await this.productRepository.create(product)

        const store = await this.storeRepository.create({
          productId: createdProduct.id,
          warehouseId: product.warehouseId,
        })

        const supplierProduct = await this.supplierProductRepository.create({
          supplierId: product.supplierId,
          productId: createdProduct.id,
        })

        await queryRunner.commitTransaction()

        return plainToInstance(ProductResponseDto, {
          ...createdProduct,
          warehouseId: store.warehouseId,
          supplierId: supplierProduct.supplierId,
        })
      } catch (error) {
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        await queryRunner.release()
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to create product')
    }
  }

  async getProduct(id: string): Promise<ProductResponseDto> {
    try {
      const supplierProduct =
        await this.supplierProductRepository.getSupplierProductById(id)
      if (!supplierProduct) {
        throw new Error('Product not found')
      }

      const store = await this.storeRepository.getStoreById(id)
      if (!store) {
        throw new Error('Store not found')
      }

      const product = await this.productRepository.findOne({ id })
      if (!product) {
        throw new Error('Product not found')
      }

      return plainToInstance(ProductResponseDto, {
        ...product,
        warehouse: store.warehouse,
        supplier: supplierProduct.supplier,
      })
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get product')
    }
  }

  async updateProduct(
    id: string,
    product: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.productRepository.findOne({ id })
    if (!existingProduct) {
      throw new Error('Product not found')
    }
    const updatedProduct = await this.productRepository.update(id, product)
    return plainToInstance(ProductResponseDto, updatedProduct)
  }

  async deleteProduct(id: string): Promise<boolean> {
    const existingProduct = await this.productRepository.findOne({ id })
    if (!existingProduct) {
      return false
    }
    await this.productRepository.delete(id)
    return true
  }

  async getAllProductsByWarehouse(
    filters?: Partial<ProductEntity>,
    query?: PageOptionsDto,
    warehouseId?: string
  ): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findProductsByWarehouse(
      filters ?? {},
      query,
      warehouseId
    )
    return plainToInstance(ProductResponseDto, products)
  }

  async getProductsByName(
    name: string,
    query?: PageOptionsDto
  ): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findProductsByName(
      name,
      query
    )
    return plainToInstance(ProductResponseDto, products)
  }

  async getDistinctProducts(
    filters?: Partial<ProductEntity>,
    query?: PageOptionsDto,
    warehouseId?: string
  ): Promise<DistinctProductResponseDto[]> {
    return await this.productRepository.findDistinctProducts(
      filters ?? {},
      query,
      warehouseId
    )
  }
}
