import { plainToInstance } from 'class-transformer'
import { inject, injectable } from 'tsyringe'

import { REPOSITORY_INJECTION_TOKEN } from '../config/enums'
import {
  CreateEmployeeDto,
  EmployeeResponseDto,
  PageOptionsDto,
  UpdateEmployeeDto,
} from '../core/dtos'
import { EmployeeEntity } from '../core/entities'
import { BadRequestException, InternalServerError } from '../core/exceptions'
import type { IEmployeeRepository } from '../core/repositories'

import { IEmployeeService } from './adapters/employee.interface'

@injectable()
export class EmployeeService implements IEmployeeService {
  constructor(
    @inject(REPOSITORY_INJECTION_TOKEN.EMPLOYEE)
    private readonly employeeRepository: IEmployeeRepository
  ) {}

  async getEmployee(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ id })

    if (!employee) {
      throw new InternalServerError('Employee not found')
    }

    return plainToInstance(EmployeeResponseDto, employee)
  }

  async getEmployees(
    filters?: Partial<EmployeeEntity>,
    query?: PageOptionsDto
  ): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeeRepository.find(filters ?? {}, query)
    return plainToInstance(EmployeeResponseDto, employees)
  }

  async createEmployee(employee: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const existingEmployee = await this.employeeRepository.findOne({ email: employee.email })
    if (existingEmployee) {
      throw new BadRequestException('Employee already exists')
    }
    const createdEmployee = await this.employeeRepository.create(employee)
    return plainToInstance(EmployeeResponseDto, createdEmployee)
  }

  async updateEmployee(id: string, employee: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    const existingEmployee = await this.employeeRepository.findOne({ id })
    if (!existingEmployee) {
      throw new InternalServerError('Employee not found')
    }
    const updatedEmployee = await this.employeeRepository.update(id, employee)
    return plainToInstance(EmployeeResponseDto, updatedEmployee)
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const existingEmployee = await this.employeeRepository.findOne({ id })
    if (!existingEmployee) {
      return false
    }
    await this.employeeRepository.delete(id)
    return true
  }

  async login(email: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ email })
    if (!employee) {
      throw new InternalServerError('Employee not found')
    }
    return plainToInstance(EmployeeResponseDto, employee)
  }
}
