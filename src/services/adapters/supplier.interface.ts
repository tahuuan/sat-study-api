import {
  CreateSupplierDto,
  PageOptionsDto,
  SupplierResponseDto,
  UpdateSupplierDto,
} from '../../core/dtos'
import { SupplierEntity } from '../../core/entities'

export interface ISupplierService {
  createSupplier(supplier: CreateSupplierDto): Promise<SupplierResponseDto>

  getSupplier(id: string): Promise<SupplierResponseDto>

  updateSupplier(
    id: string,
    supplier: UpdateSupplierDto
  ): Promise<SupplierResponseDto>
  
  deleteSupplier(id: string): Promise<boolean>

  getSuppliersFromCountry(
    filters?: Partial<SupplierEntity>,
    query?: PageOptionsDto
  ): Promise<SupplierResponseDto[]>

  getSuppliersByName(
    name: string,
    query?: PageOptionsDto
  ): Promise<SupplierResponseDto[]>
}
