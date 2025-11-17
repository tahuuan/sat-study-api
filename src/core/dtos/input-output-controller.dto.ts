import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { EmployeeType, ProductCategory, Status } from '../../config/enums'
import { SupplierEntity, WarehouseEntity } from '../entities'

import { PageOptionsDto } from './page-options.dto'

// Customer
export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  phoneNumber: string

  @IsString()
  @IsNotEmpty()
  address: string
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phoneNumber?: string

  @IsString()
  @IsOptional()
  address?: string
}

export class CustomerResponseDto extends CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  id: string
}

export class QueryGetCustomersDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phoneNumber?: string

  @IsString()
  @IsOptional()
  id?: string
}

// Product
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsEnum(ProductCategory)
  @IsNotEmpty()
  category: string

  @IsString()
  @IsNotEmpty()
  warehouseId: string

  @IsString()
  @IsNotEmpty()
  supplierId: string
}

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  name?: string

  @IsNumber()
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  category?: string
}

export class ProductResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  category: string

  @IsObject()
  @IsOptional()
  warehouse?: WarehouseEntity

  @IsObject()
  @IsOptional()
  supplier?: SupplierEntity
}
export class QueryGetProductsDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsNumber()
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  category?: string

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean

  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsNotEmpty()
  warehouseId: string
}

export class QueryGetDistinctProductsDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  category?: string

  @IsNumber()
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  warehouseId?: string

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean
}

export class DistinctProductResponseDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  count: number

  @IsString()
  @IsNotEmpty()
  id: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  category: string
}

// Warehouse
export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  capacity: number

  @IsString()
  @IsNotEmpty()
  location: string
}

export class UpdateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  name?: string

  @IsNumber()
  @IsOptional()
  capacity?: number

  @IsString()
  @IsOptional()
  location?: string
}

export class WarehouseResponseDto extends CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  id: string
}

export class QueryGetWarehousesDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string
}

// Supplier
export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  country: string

  @IsString()
  @IsNotEmpty()
  contactPhone: string

  @IsString()
  @IsNotEmpty()
  contactEmail: string
}

export class UpdateSupplierDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  country?: string

  @IsString()
  @IsOptional()
  contactPhone?: string

  @IsString()
  @IsOptional()
  contactEmail?: string
}

export class SupplierResponseDto extends CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  id: string
}

export class QueryGetSuppliersCountryDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  country?: string
}

export class QueryGetSuppliersNameDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string
}

// Order
export class CreateProductOrderDto {
  @IsArray()
  @IsNotEmpty()
  productName: string

  @IsNumber()
  @IsNotEmpty()
  quantity: number
}

export class QueryCreateOrderDto {
  @IsString()
  @IsNotEmpty()
  warehouseId: string

  @IsString()
  @IsNotEmpty()
  customerId: string

  @IsNumber()
  @IsNotEmpty()
  total: number
}
export class OrderResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsDate()
  @IsNotEmpty()
  orderDate: Date

  @IsString()
  @IsNotEmpty()
  status: string

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number

  @IsString()
  @IsNotEmpty()
  customerId: string
}

export class OrderDetailResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number

  @IsArray()
  @IsNotEmpty()
  product: CreateProductOrderDto[]
}

export class UpdateOrderStatusDto {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status
}

export class QueryGetOrdersDto extends PageOptionsDto {
  @IsEnum(Status)
  @IsOptional()
  status?: Status

  @IsString()
  @IsOptional()
  customerId?: string

  @IsString()
  @IsOptional()
  warehouseId?: string
}

// Employee
export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  phoneNumber: string

  @IsNumber()
  @IsNotEmpty()
  salary: number

  @IsString()
  @IsNotEmpty()
  warehouseId: string

  @IsEnum(EmployeeType)
  @IsNotEmpty()
  type: EmployeeType
}

export class UpdateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phoneNumber?: string

  @IsNumber()
  @IsOptional()
  salary?: number

  @IsString()
  @IsOptional()
  warehouseId?: string

  @IsEnum(EmployeeType)
  @IsOptional()
  type?: EmployeeType
}

export class EmployeeResponseDto extends CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsObject()
  @IsOptional()
  warehouse?: WarehouseEntity
}

export class QueryGetEmployeesDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phoneNumber?: string

  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  warehouseId?: string

  @IsEnum(EmployeeType)
  @IsOptional()
  type?: EmployeeType 
}

// Delivery Partner
export class CreateDeliveryPartnerDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  serviceType?: string

  @IsString()
  @IsNotEmpty()
  contactPhone: string

  @IsString()
  @IsNotEmpty()
  contactEmail: string
}

export class UpdateDeliveryPartnerDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  serviceType?: string

  @IsString()
  @IsOptional()
  contactPhone?: string

  @IsString()
  @IsOptional()
  contactEmail?: string
}

export class DeliveryPartnerResponseDto extends CreateDeliveryPartnerDto {
  @IsString()
  @IsNotEmpty()
  id: string
}

export class QueryGetDeliveryPartnersDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  serviceType?: string

  @IsString()
  @IsOptional()
  contactPhone?: string
}

// Shipment
export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string

  @IsString()
  @IsNotEmpty()
  status: string

  @IsString()
  @IsNotEmpty()
  estimatedDeliveryDate: string

  @IsString()
  @IsNotEmpty()
  carrierId: string
}

export class UpdateShipmentDto {
  @IsString()
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  estimatedDeliveryDate?: string

  @IsString()
  @IsOptional()
  carrierId?: string
}

export class ShipmentResponseDto extends CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  id: string
}
