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
  CreateCustomerDto,
  CustomerResponseDto,
  QueryGetCustomersDto,
  UpdateCustomerDto,
} from '../core/dtos/input-output-controller.dto'
import { CustomerEntity } from '../core/entities'
import { CustomerService } from '../services/customer.service'

@injectable()
@Controller('/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/')
  async createCustomer(
    @Body() customer: CreateCustomerDto
  ): Promise<CustomerResponseDto> {
    return await this.customerService.createCustomer(customer)
  }

  @Get('/login/:email')
  async login(@Param('email') email: string): Promise<CustomerResponseDto> {
    return await this.customerService.login(email)
  }

  @Get('/:id')
  async getCustomer(@Param('id') id: string): Promise<CustomerResponseDto> {
    return await this.customerService.getCustomer(id)
  }

  @Put('/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customer: UpdateCustomerDto
  ): Promise<CustomerResponseDto> {
    const updateCustomer: Partial<CustomerEntity> = {
      id: id,
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
    }
    return await this.customerService.updateCustomer(updateCustomer)
  }

  @Delete('/:id')
  async deleteCustomer(@Param('id') id: string): Promise<boolean> {
    return await this.customerService.deleteCustomer(id)
  }

  @Get('/')
  async getAllCustomers(
    @QueryParams()
    query: QueryGetCustomersDto
  ): Promise<CustomerResponseDto[]> {
    const filters: Partial<CustomerEntity> = {
      name: query.name,
      email: query.email,
      phoneNumber: query.phoneNumber,
      id: query.id,
    }

    const customers = await this.customerService.getAllCustomers(filters, query)
    return customers
  }
}
