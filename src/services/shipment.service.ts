import { InternalServerError } from 'routing-controllers'
import { inject, injectable } from 'tsyringe'

import { REPOSITORY_INJECTION_TOKEN, Status } from '../config/enums'
import {
  CreateShipmentDto,
  ShipmentResponseDto,
  UpdateShipmentDto,
} from '../core/dtos/input-output-controller.dto'
import type {
  IOrderRepository,
  IShipmentRepository,
} from '../core/repositories'

import { IShipmentService } from './adapters/shipment.interface'

@injectable()
export class ShipmentService implements IShipmentService {
  constructor(
    @inject(REPOSITORY_INJECTION_TOKEN.SHIPMENT)
    private readonly shipmentRepository: IShipmentRepository,

    @inject(REPOSITORY_INJECTION_TOKEN.ORDER)
    private readonly orderRepository: IOrderRepository
  ) {}

  async createShipment(
    shipment: CreateShipmentDto
  ): Promise<ShipmentResponseDto> {
    try {
      const order = await this.orderRepository.findOne({
        id: shipment.orderId,
      })
      if (!order) {
        throw new Error('Order not found')
      }

      const newShipment = await this.shipmentRepository.create({
        status: shipment.status,
        estimatedDeliveryDate: shipment.estimatedDeliveryDate,
        carrierId: shipment.carrierId,
      })

      await this.orderRepository.update(order.id, {
        status: Status.SHIPPING,
        shipmentId: newShipment.id,
      })

      return {
        ...newShipment,
        orderId: order.id,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new InternalServerError('Cannot shipping the order')
    }
  }

  async updateShipment(
    orderId: string,
    shipment: UpdateShipmentDto
  ): Promise<ShipmentResponseDto> {
    const order = await this.orderRepository.findOne({
      id: orderId,
    })
    if (!order) {
      throw new InternalServerError('Order not found')
    }
    if (!order.shipmentId) {
      throw new InternalServerError('Order has no shipment')
    }

    const updatedShipment = await this.shipmentRepository.update(
      order.shipmentId,
      {
        status: shipment.status,
        estimatedDeliveryDate: shipment.estimatedDeliveryDate,
        carrierId: shipment.carrierId,
      }
    )

    return {
      ...updatedShipment,
      orderId: order.id,
    }
  }

  async getShipmentById(id: string): Promise<ShipmentResponseDto> {
    const order = await this.orderRepository.findOne({
      id
    })
    if (!order) {
      throw new InternalServerError('Order not found')
    }
    if (!order.shipmentId) {
      throw new InternalServerError('Order has no shipment')
    }

    const shipment = await this.shipmentRepository.findOne({
      id: order.shipmentId,
    })
    if (!shipment) {
      throw new InternalServerError('Shipment not found')
    }
    return {
      ...shipment,
      orderId: order.id,
    }
  }
}
