import { Body, Controller, Get, Param, Patch, Post, QueryParams } from 'routing-controllers'
import { injectable } from 'tsyringe'

import {
  CreateProductOrderDto,
  OrderDetailResponseDto,
  OrderResponseDto,
  QueryCreateOrderDto,
  QueryGetOrdersDto,
  UpdateOrderStatusDto,
} from '../core/dtos'
import { OrderEntity } from '../core/entities'
import { OrderService } from '../services/order.service'

@injectable()
@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  async createOrder(
    @Body() order: CreateProductOrderDto[],
    @QueryParams() query: QueryCreateOrderDto
  ): Promise<OrderResponseDto> {
    return await this.orderService.createCustomerOrder(
      order,
      query.warehouseId,
      query.customerId,
      query.total
    )
  }

  @Get('/')
  async getOrders(
    @QueryParams() query: QueryGetOrdersDto
  ): Promise<OrderResponseDto[]> {
    const filters: Partial<OrderEntity> = {
      status: query.status,
      customerId: query.customerId,
      warehouseId: query.warehouseId,
    }
    return await this.orderService.getOrderByCondition(filters, query)
  }

  @Post('/cancel/:id')
  async cancelOrder(@Param('id') id: string): Promise<OrderResponseDto> {
    console.log('id', id)
    return await this.orderService.cancelOrder(id)
  }

  @Patch('/:id')
  async updateOrderStatus(
    @Param('id') id: string,
    @QueryParams() query: UpdateOrderStatusDto
  ): Promise<OrderResponseDto> {
    return await this.orderService.updateOrderStatus(id, query.status)
  }

  @Get('/:id')
  async getOrderById(@Param('id') id: string): Promise<OrderDetailResponseDto> {
    console.log('id', id)
    return await this.orderService.getOrderById(id)
  }
}
