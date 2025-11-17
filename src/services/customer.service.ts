import { plainToInstance } from 'class-transformer'
import { inject, injectable } from 'tsyringe'

import { REPOSITORY_INJECTION_TOKEN } from '../config/enums'
import { CreateCustomerDto, CustomerResponseDto, PageOptionsDto } from '../core/dtos'
import { CustomerEntity } from '../core/entities'
import type { ICustomerRepository } from '../core/repositories'

import { ICustomerService } from './adapters/customer.interface'


@injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @inject(REPOSITORY_INJECTION_TOKEN.CUSTOMER)
    private readonly customerRepository: ICustomerRepository
  ) {}

  async createCustomer(customer: CreateCustomerDto): Promise<CustomerResponseDto> {
    const createdCustomer = await this.customerRepository.create(customer)
    return plainToInstance(CustomerResponseDto, createdCustomer)
  }

  async getCustomer(id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findOne({ id })
    if (!customer) {
      throw new Error('Customer not found')
    }
    return plainToInstance(CustomerResponseDto, customer)
  }

  async updateCustomer(
    customer: Partial<CustomerEntity>
  ): Promise<CustomerResponseDto> {
    try {
      const existingCustomer = await this.customerRepository.findOne({ id: customer.id })
      if (!existingCustomer) {
        throw new Error('Customer not found')
      }
      const updatedCustomer = await this.customerRepository.update(
        customer.id ?? '',
        customer
      )
      return plainToInstance(CustomerResponseDto, updatedCustomer)
    } catch (error) {
      throw new Error(`Failed to update customer: ${error as string}`)
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const existingCustomer = await this.customerRepository.findOne({ id })
      if (!existingCustomer) {
        return false
      }
      await this.customerRepository.delete(id)
      return true
    } catch (error) {
      throw new Error(`Failed to delete customer: ${error as string}`)
    }
  }

  async getAllCustomers(
    filters?: Partial<CustomerEntity>,
    query?: PageOptionsDto
  ): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.find(filters ?? {}, query)
    return plainToInstance(CustomerResponseDto, customers)
  }

  async login(email: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findOne({ email })
    if (!customer) {
      throw new Error('Customer not found')
    }
    return plainToInstance(CustomerResponseDto, customer)
  }
}
