import { inject, injectable } from 'tsyringe'

import { appDataSource } from '../config/database/mssql/db.config'
import { REPOSITORY_INJECTION_TOKEN, Status } from '../config/enums'
import {
  CreateProductOrderDto,
  OrderDetailResponseDto,
  OrderResponseDto,
  PageOptionsDto,
} from '../core/dtos'
import { OrderDetailEntity, OrderEntity } from '../core/entities'
import { InternalServerError } from '../core/exceptions'
import type {
  IOrderDetailRepository,
  IOrderRepository,
  IProductRepository,
  IShipmentRepository,
} from '../core/repositories'

import { IOrderService } from './index'

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject(REPOSITORY_INJECTION_TOKEN.ORDER)
    private readonly orderRepository: IOrderRepository,

    @inject(REPOSITORY_INJECTION_TOKEN.ORDER_DETAIL)
    private readonly orderDetailRepository: IOrderDetailRepository,

    @inject(REPOSITORY_INJECTION_TOKEN.PRODUCT)
    private readonly productRepository: IProductRepository,

    @inject(REPOSITORY_INJECTION_TOKEN.SHIPMENT)
    private readonly shipmentRepository: IShipmentRepository
  ) {}

  async createCustomerOrder(
    order: CreateProductOrderDto[],
    warehouseId: string,
    customerId: string,
    total: number
  ): Promise<OrderResponseDto> {
    const queryRunner = appDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const initOrder = await this.orderRepository.create({
        status: Status.PROCESSING,
        orderDate: new Date(),
        totalAmount: total,
        customerId,
        warehouseId,
      })

      const productPromises = order.map(orderItem =>
        this.productRepository.findProductByNameInWarehouse(
          orderItem.productName,
          orderItem.quantity,
          warehouseId,
          true
        )
      )
      const productsResults = await Promise.all(productPromises)

      if (
        productsResults.some(
          (products, index) =>
            order[index] && products.length < order[index].quantity
        )
      ) {
        throw new Error(`Insufficient products available`)
      }

      const allProducts = productsResults.flat()

      await Promise.all(
        allProducts.map(product =>
          this.productRepository.update(product.id, {
            isAvailable: false,
          })
        )
      )

      const orderDetails: OrderDetailEntity[] = allProducts.map(product => ({
        orderId: initOrder.id,
        productId: product.id,
        product: product,
      }))

      await this.orderDetailRepository.createMany(orderDetails)
      await queryRunner.commitTransaction()

      return {
        id: initOrder.id,
        orderDate: initOrder.orderDate,
        status: initOrder.status,
        customerId: initOrder.customerId,
        totalAmount: initOrder.totalAmount,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new Error(error as string)
    } finally {
      await queryRunner.release()
    }
  }

  async getOrderByCondition(
    filters?: Partial<OrderEntity>,
    query?: PageOptionsDto
  ): Promise<OrderResponseDto[]> {
    try {
      const orders = await this.orderRepository.find(filters ?? {}, query)

      return orders.map(order => ({
        id: order.id,
        orderDate: order.orderDate,
        status: order.status,
        customerId: order.customerId,
        totalAmount: order.totalAmount,
      }))
    } catch (error) {
      throw new Error(error as string)
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: Status
  ): Promise<OrderResponseDto> {
    try {
      const order = await this.orderRepository.update(orderId, { status })

      if (status === Status.SUCCESS || status === Status.CANCELLED) {
        if (order.shipmentId) {
          await this.orderRepository.update(orderId, { shipmentId: undefined })
          await this.shipmentRepository.delete(order.shipmentId)
        }
      }

      return {
        id: order.id,
        orderDate: order.orderDate,
        status: order.status,
        customerId: order.customerId,
        totalAmount: order.totalAmount,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new InternalServerError('Cannot update order status')
    }
  }

  async cancelOrder(orderId: string): Promise<OrderResponseDto> {
    const queryRunner = appDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const order = await this.orderRepository.findOne({
        id: orderId,
      })

      if (!order) {
        throw new Error('Order not found')
      }
      if (order.status !== Status.PROCESSING) {
        throw new Error('Order cannot be cancelled')
      }

      await this.orderRepository.update(orderId, {
        status: Status.CANCELLED,
      })
      const orderDetails = await this.orderDetailRepository.find({
        orderId,
      })
      await Promise.all(
        orderDetails.map(detail =>
          this.productRepository.update(detail.productId, { isAvailable: true })
        )
      )
      await queryRunner.commitTransaction()
      return {
        id: order.id,
        orderDate: order.orderDate,
        status: order.status,
        customerId: order.customerId,
        totalAmount: order.totalAmount,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new Error(error as string)
    } finally {
      await queryRunner.release()
    }
  }

  async getOrderById(orderId: string): Promise<OrderDetailResponseDto> {
    const orderDetails =
      await this.orderDetailRepository.getOrderDetails(orderId)

    const productMap: Record<string, { quantity: number; price: number }> = {}
    let totalAmount = 0

    for (const detail of orderDetails) {
      const name = detail.product.name
      const price = detail.product.price
      productMap[name] = productMap[name] ?? { quantity: 0, price }
      productMap[name].quantity += 1
      totalAmount += price
    }

    const product = Object.entries(productMap).map(
      ([productName, { quantity }]) => ({
        productName,
        quantity,
      })
    ) as CreateProductOrderDto[]

    return {
      id: orderId,
      totalAmount,
      product,
    }
  }
}
