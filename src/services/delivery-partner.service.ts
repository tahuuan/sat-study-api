import { plainToInstance } from 'class-transformer'
import { inject, injectable } from 'tsyringe'

import { REPOSITORY_INJECTION_TOKEN } from '../config/enums'
import {
  CreateDeliveryPartnerDto,
  DeliveryPartnerResponseDto,
  PageOptionsDto,
  UpdateDeliveryPartnerDto,
} from '../core/dtos'
import { DeliveryPartnerEntity } from '../core/entities'
import { Exception, InternalServerError } from '../core/exceptions'
import type { IDeliveryPartnerRepository } from '../core/repositories'

import { IDeliveryPartnerService } from './adapters/delivery-partner.interface'

@injectable()
export class DeliveryPartnerService implements IDeliveryPartnerService {
  constructor(
    @inject(REPOSITORY_INJECTION_TOKEN.DELIVERY_PARTNER)
    private readonly deliveryPartnerRepository: IDeliveryPartnerRepository
  ) {}

  async createDeliveryPartner(
    deliveryPartner: CreateDeliveryPartnerDto
  ): Promise<DeliveryPartnerResponseDto> {
    const createdDeliveryPartner =
      await this.deliveryPartnerRepository.create(deliveryPartner)
    return plainToInstance(DeliveryPartnerResponseDto, createdDeliveryPartner)
  }

  async getDeliveryPartnerById(
    id: string
  ): Promise<DeliveryPartnerResponseDto> {
    const deliveryPartner = await this.deliveryPartnerRepository.findOne({ id })
    return plainToInstance(DeliveryPartnerResponseDto, deliveryPartner)
  }

  async getListDeliveryPartner(
    filter: Partial<DeliveryPartnerEntity>,
    query?: PageOptionsDto
  ): Promise<DeliveryPartnerResponseDto[]> {
    const deliveryPartners = await this.deliveryPartnerRepository.find(
      filter,
      query
    )
    return plainToInstance(DeliveryPartnerResponseDto, deliveryPartners)
  }

  async updateDeliveryPartner(
    id: string,
    deliveryPartner: UpdateDeliveryPartnerDto
  ): Promise<DeliveryPartnerResponseDto> {
    try {
      const existingDeliveryPartner =
        await this.deliveryPartnerRepository.findOne({ id })
      if (!existingDeliveryPartner) {
        throw new InternalServerError('Delivery partner not found')
      }
      const updatedDeliveryPartner =
        await this.deliveryPartnerRepository.update(id, deliveryPartner)
      return plainToInstance(DeliveryPartnerResponseDto, updatedDeliveryPartner)
    } catch (error) {
      if (error instanceof Exception) {
        throw error
      }
      throw new InternalServerError('Failed to update delivery partner')
    }
  }

  async deleteDeliveryPartner(id: string): Promise<boolean> {
    const existingDeliveryPartner =
      await this.deliveryPartnerRepository.findOne({ id })
    if (!existingDeliveryPartner) {
      return false
    }
    await this.deliveryPartnerRepository.delete(id)
    return true
  }
}
