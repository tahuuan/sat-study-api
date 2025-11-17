import {
  CreateEmployeeDto,
  EmployeeResponseDto,
  QueryGetEmployeesDto,
  UpdateEmployeeDto,
} from '../../core/dtos'

export interface IEmployeeService {
  getEmployee(id: string): Promise<EmployeeResponseDto>
  getEmployees(query: QueryGetEmployeesDto): Promise<EmployeeResponseDto[]>
  createEmployee(employee: CreateEmployeeDto): Promise<EmployeeResponseDto>
  updateEmployee(
    id: string,
    employee: UpdateEmployeeDto
  ): Promise<EmployeeResponseDto>
  deleteEmployee(id: string): Promise<boolean>
}
