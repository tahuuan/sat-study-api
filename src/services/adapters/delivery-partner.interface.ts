import {
  CreateDeliveryPartnerDto,
  DeliveryPartnerResponseDto,
  PageOptionsDto,
  UpdateDeliveryPartnerDto,
} from '../../core/dtos'
import { DeliveryPartnerEntity } from '../../core/entities'

export interface IDeliveryPartnerService {
  createDeliveryPartner(
    deliveryPartner: CreateDeliveryPartnerDto
  ): Promise<DeliveryPartnerResponseDto>

  getDeliveryPartnerById(id: string): Promise<DeliveryPartnerResponseDto>

  getListDeliveryPartner(
    filter: Partial<DeliveryPartnerEntity>,
    query?: PageOptionsDto
  ): Promise<DeliveryPartnerResponseDto[]>

  updateDeliveryPartner(
    id: string,
    deliveryPartner: UpdateDeliveryPartnerDto
  ): Promise<DeliveryPartnerResponseDto>

  deleteDeliveryPartner(id: string): Promise<boolean>
}
