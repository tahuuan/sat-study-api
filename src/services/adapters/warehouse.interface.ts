import {
  CreateWarehouseDto,
  PageOptionsDto,
  WarehouseResponseDto,
} from '../../core/dtos'
import { WarehouseEntity } from '../../core/entities'

export interface IWarehouseService {
  createWarehouse(warehouse: CreateWarehouseDto): Promise<WarehouseResponseDto>

  getWarehouse(id: string): Promise<WarehouseResponseDto>

  updateWarehouse(
    id: string,
    warehouse: Partial<WarehouseEntity>
  ): Promise<WarehouseResponseDto>

  deleteWarehouse(id: string): Promise<boolean>

  getAllWarehouses(
    filters?: Partial<WarehouseEntity>,
    query?: PageOptionsDto
  ): Promise<WarehouseResponseDto[]>
}
