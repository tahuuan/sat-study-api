import {
  CreateCustomerDto,
  CustomerResponseDto,
} from '../../core/dtos/input-output-controller.dto'
import { PageOptionsDto } from '../../core/dtos/page-options.dto'
import { CustomerEntity } from '../../core/entities'
export interface ICustomerService {
  createCustomer(customer: CreateCustomerDto): Promise<CustomerEntity>

  getCustomer(id: string): Promise<CustomerEntity>

  updateCustomer(
    customer: Partial<CustomerEntity>
  ): Promise<CustomerEntity>

  deleteCustomer(id: string): Promise<boolean>

  getAllCustomers(
    filters?: Partial<CustomerEntity>,
    query?: PageOptionsDto
  ): Promise<CustomerResponseDto[]>
}
