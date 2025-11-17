import { CreateShipmentDto, ShipmentResponseDto, UpdateShipmentDto } from '../../core/dtos'

export interface IShipmentService {
  createShipment(shipment: CreateShipmentDto): Promise<ShipmentResponseDto>
  updateShipment(
    orderId: string,
    shipment: UpdateShipmentDto
  ): Promise<ShipmentResponseDto>
}
