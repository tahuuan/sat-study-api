import { plainToInstance } from 'class-transformer'
import { inject, injectable } from 'tsyringe'

import { REPOSITORY_INJECTION_TOKEN } from '../config/enums'
import { CreateWarehouseDto, PageOptionsDto, WarehouseResponseDto } from '../core/dtos'
import { WarehouseEntity } from '../core/entities'
import type { IWarehouseRepository } from '../core/repositories'

import { IWarehouseService } from './adapters/warehouse.interface'


@injectable()
export class WarehouseService implements IWarehouseService {
  constructor(
    @inject(REPOSITORY_INJECTION_TOKEN.WAREHOUSE)
    private readonly warehouseRepository: IWarehouseRepository
  ) {}

  async createWarehouse(warehouse: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    const createdWarehouse = await this.warehouseRepository.create(warehouse)
    return plainToInstance(WarehouseResponseDto, createdWarehouse)
  }

  async getWarehouse(id: string): Promise<WarehouseResponseDto> {
    const warehouse = await this.warehouseRepository.findOne({ id })
    if (!warehouse) {
      throw new Error('Warehouse not found')
    }
    return plainToInstance(WarehouseResponseDto, warehouse)
  }

  async updateWarehouse(
    id: string,
    warehouse: Partial<WarehouseEntity>
  ): Promise<WarehouseResponseDto> {
    const existingWarehouse = await this.warehouseRepository.findOne({ id })
    if (!existingWarehouse) {
      throw new Error('Warehouse not found')
    }
    const updatedWarehouse = await this.warehouseRepository.update(id, warehouse)
    return plainToInstance(WarehouseResponseDto, updatedWarehouse)
  }

  async deleteWarehouse(id: string): Promise<boolean> {
    const existingWarehouse = await this.warehouseRepository.findOne({ id })
    if (!existingWarehouse) {
      return false
    }
    await this.warehouseRepository.delete(id)
    return true
  }

  async getAllWarehouses(
    filters?: Partial<WarehouseEntity>,
    query?: PageOptionsDto
  ): Promise<WarehouseResponseDto[]> {
    const warehouses = await this.warehouseRepository.find(filters ?? {}, query)
    return plainToInstance(WarehouseResponseDto, warehouses)
  }
}
