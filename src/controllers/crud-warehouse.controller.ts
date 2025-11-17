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
  CreateWarehouseDto,
  QueryGetWarehousesDto,
  WarehouseResponseDto,
} from '../core/dtos/input-output-controller.dto'
import { WarehouseEntity } from '../core/entities'
import { WarehouseService } from '../services/warehouse.service'

@injectable()
@Controller('/warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post('/')
  async createWarehouse(
    @Body() warehouse: CreateWarehouseDto
  ): Promise<WarehouseResponseDto> {
    return await this.warehouseService.createWarehouse(warehouse)
  }

  @Get('/:id')
  async getWarehouse(@Param('id') id: string) {
    return await this.warehouseService.getWarehouse(id)
  }

  @Put('/:id')
  async updateWarehouse(
    @Param('id') id: string,
    @Body() warehouse: Partial<WarehouseEntity>
  ) {
    return await this.warehouseService.updateWarehouse(id, warehouse)
  }

  @Delete('/:id')
  async deleteWarehouse(@Param('id') id: string) {
    const success = await this.warehouseService.deleteWarehouse(id)
    if (!success) {
      throw new Error('Warehouse not found')
    }
    return { message: 'Warehouse deleted successfully' }
  }

  @Get('/')
  async getAllWarehouses(
    @QueryParams()
    query: QueryGetWarehousesDto
  ): Promise<WarehouseResponseDto[]> {
    const filters: Partial<WarehouseEntity> = {
      name: query.name,
    }
    return await this.warehouseService.getAllWarehouses(filters, query)
  }
}
