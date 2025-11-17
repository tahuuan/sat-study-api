import { Status } from '../../config/enums'
import {
  CreateProductOrderDto,
  OrderResponseDto,
  PageOptionsDto,
} from '../../core/dtos'
import { OrderEntity } from '../../core/entities'

export interface IOrderService {
  createCustomerOrder(
    order: CreateProductOrderDto[],
    warehouseId: string,
    customerId: string,
    total: number
  ): Promise<OrderResponseDto>

  getOrderByCondition(
    filters?: Partial<OrderEntity>,
    query?: PageOptionsDto
  ): Promise<OrderResponseDto[]>

  updateOrderStatus(orderId: string, status: Status): Promise<OrderResponseDto>
}
