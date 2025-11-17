import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from 'routing-controllers'
import { injectable } from 'tsyringe'

import {
  CreateShipmentDto,
  ShipmentResponseDto,
  UpdateShipmentDto,
} from '../core/dtos'
import { ShipmentService } from '../services/shipment.service'

@injectable()
@Controller('/shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post('/')
  async createShipment(
    @Body() shipment: CreateShipmentDto
  ): Promise<ShipmentResponseDto> {
    return await this.shipmentService.createShipment(shipment)
  }

  @Patch('/:id')
  async updateShipment(
    @Param('id') id: string,
    @Body() shipment: UpdateShipmentDto
  ): Promise<ShipmentResponseDto> {
    return await this.shipmentService.updateShipment(id, shipment)
  }

  @Get('/:id')
  async getShipmentById(@Param('id') id: string): Promise<ShipmentResponseDto> {
    return await this.shipmentService.getShipmentById(id)
  }
}
