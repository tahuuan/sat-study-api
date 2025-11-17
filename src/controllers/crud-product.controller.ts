import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParams,
} from 'routing-controllers'
import { injectable } from 'tsyringe'

import {
  CreateProductDto,
  DistinctProductResponseDto,
  ProductResponseDto,
  QueryGetDistinctProductsDto,
  QueryGetProductsDto,
  UpdateProductDto,
} from '../core/dtos/input-output-controller.dto'
import { ProductEntity } from '../core/entities'
import { ProductService } from '../services/product.service'

@injectable()
@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/')
  async createProduct(
    @Body() product: CreateProductDto
  ): Promise<ProductResponseDto> {
    return await this.productService.createProduct(product)
  }

  @Get('/distinct')
  async getDistinctProducts(
    @QueryParams() query: QueryGetDistinctProductsDto
  ): Promise<DistinctProductResponseDto[]> {
    const filters: Partial<ProductEntity> = {
      name: query.name,
      price: query.price,
      category: query.category,
      isAvailable: query.isAvailable,
    }
    return await this.productService.getDistinctProducts(
      filters,
      query,
      query.warehouseId
    )
  }

  @Get('/text')
  async getProductsByName(
    @QueryParams()
    query: QueryGetProductsDto
  ): Promise<ProductResponseDto[]> {
    return await this.productService.getProductsByName(query.name ?? '', query)
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string): Promise<ProductResponseDto> {
    return await this.productService.getProduct(id)
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return await this.productService.updateProduct(id, product)
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const success = await this.productService.deleteProduct(id)
    if (!success) {
      throw new Error('Product not found')
    }
    return { message: 'Product deleted successfully' }
  }

  @Get('/')
  async getAllProducts(
    @QueryParams()
    query: QueryGetProductsDto
  ): Promise<ProductResponseDto[]> {
    const filters: Partial<ProductEntity> = {
      id: query.id,
      name: query.name,
      price: query.price,
      category: query.category,
      isAvailable: query.isAvailable,
    }

    const products = await this.productService.getAllProductsByWarehouse(
      filters,
      query,
      query.warehouseId
    )
    return products
  }
}
