import { plainToInstance } from 'class-transformer'
import { inject, injectable } from 'tsyringe'

import { REPOSITORY_INJECTION_TOKEN } from '../config/enums'
import {
  CreateSupplierDto,
  PageOptionsDto,
  SupplierResponseDto,
} from '../core/dtos'
import { SupplierEntity } from '../core/entities'
import type { ISupplierRepository } from '../core/repositories'

import { ISupplierService } from './adapters/supplier.interface'

@injectable()
export class SupplierService implements ISupplierService {
  constructor(
    @inject(REPOSITORY_INJECTION_TOKEN.SUPPLIER)
    private readonly supplierRepository: ISupplierRepository
  ) {}

  async createSupplier(
    supplier: CreateSupplierDto
  ): Promise<SupplierResponseDto> {
    const createdSupplier = await this.supplierRepository.create(supplier)
    return plainToInstance(SupplierResponseDto, createdSupplier)
  }

  async getSupplier(id: string): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({ id })
    if (!supplier) {
      throw new Error('Supplier not found')
    }
    return plainToInstance(SupplierResponseDto, supplier)
  }

  async updateSupplier(
    id: string,
    supplier: Partial<SupplierEntity>
  ): Promise<SupplierResponseDto> {
    const existingSupplier = await this.supplierRepository.findOne({ id })
    if (!existingSupplier) {
      throw new Error('Supplier not found')
    }
    const updatedSupplier = await this.supplierRepository.update(id, supplier)
    return plainToInstance(SupplierResponseDto, updatedSupplier)
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const existingSupplier = await this.supplierRepository.findOne({ id })
    if (!existingSupplier) {
      return false
    }
    await this.supplierRepository.delete(id)
    return true
  }

  async getSuppliersFromCountry(
    filters?: Partial<SupplierEntity>,
    query?: PageOptionsDto
  ): Promise<SupplierResponseDto[]> {
    const suppliers = await this.supplierRepository.find(filters ?? {}, query)
    return plainToInstance(SupplierResponseDto, suppliers)
  }

  async getSuppliersByName(
    name: string,
    query?: PageOptionsDto
  ): Promise<SupplierResponseDto[]> {
    const suppliers = await this.supplierRepository.findSuppliersByName(
      name,
      query
    )
    return plainToInstance(SupplierResponseDto, suppliers)
  }
}
