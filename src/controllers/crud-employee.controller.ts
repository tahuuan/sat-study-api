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
  CreateEmployeeDto,
  EmployeeResponseDto,
  QueryGetEmployeesDto,
  UpdateEmployeeDto,
} from '../core/dtos'
import { EmployeeEntity } from '../core/entities'
import { EmployeeService } from '../services/employee.service'

@injectable()
@Controller('/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('/')
  async getEmployees(
    @QueryParams() query: QueryGetEmployeesDto
  ): Promise<EmployeeResponseDto[]> {
    const filter: Partial<EmployeeEntity> = {
      name: query.name,
      email: query.email,
      phoneNumber: query.phoneNumber,
      id: query.id,
      warehouseId: query.warehouseId,
      type: query.type,
    }
    return await this.employeeService.getEmployees(filter, query)
  }

  @Get('/:id')
  async getEmployee(@Param('id') id: string): Promise<EmployeeResponseDto> {
    return await this.employeeService.getEmployee(id)
  }

  @Get('/login/:email')
  async login(@Param('email') email: string): Promise<EmployeeResponseDto> {
    return await this.employeeService.login(email)
  }

  @Post('/')
  async createEmployee(
    @Body() employee: CreateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    return await this.employeeService.createEmployee(employee)
  }

  @Put('/:id')
  async updateEmployee(
    @Param('id') id: string,
    @Body() employee: UpdateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    return await this.employeeService.updateEmployee(id, employee)
  }

  @Delete('/:id')
  async deleteEmployee(@Param('id') id: string): Promise<boolean> {
    return await this.employeeService.deleteEmployee(id)
  }
}
