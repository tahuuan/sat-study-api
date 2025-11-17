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
  CreateSupplierDto,
  QueryGetSuppliersCountryDto,
  QueryGetSuppliersNameDto,
  SupplierResponseDto,
} from '../core/dtos/input-output-controller.dto'
import { SupplierEntity } from '../core/entities'
import { SupplierService } from '../services/supplier.service'

@injectable()
@Controller('/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('/')
  async createSupplier(
    @Body() supplier: CreateSupplierDto
  ): Promise<SupplierResponseDto> {
    return await this.supplierService.createSupplier(supplier)
  }

  @Get('/')
  async getSupplierByName(
    @QueryParams()
    query: QueryGetSuppliersNameDto
  ): Promise<SupplierResponseDto[]> {
    return await this.supplierService.getSuppliersByName(
      query.name ?? '',
      query
    )
  }

  @Get('/country')
  async getAllSuppliersFromCountry(
    @QueryParams()
    query: QueryGetSuppliersCountryDto
  ): Promise<SupplierResponseDto[]> {
    const filters: Partial<SupplierEntity> = {
      country: query.country,
    }

    return await this.supplierService.getSuppliersFromCountry(
      filters,
      query
    )
  }

  @Get('/:id')
  async getSupplier(@Param('id') id: string) {
    return await this.supplierService.getSupplier(id)
  }

  @Put('/:id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() supplier: Partial<SupplierEntity>
  ) {
    return await this.supplierService.updateSupplier(id, supplier)
  }

  @Delete('/:id')
  async deleteSupplier(@Param('id') id: string) {
    const success = await this.supplierService.deleteSupplier(id)
    if (!success) {
      throw new Error('Supplier not found')
    }
    return { message: 'Supplier deleted successfully' }
  }
}
