import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  QueryParams,
} from 'routing-controllers'
import { injectable } from 'tsyringe'

import {
  CreateDeliveryPartnerDto,
  DeliveryPartnerResponseDto,
  QueryGetDeliveryPartnersDto,
  UpdateDeliveryPartnerDto,
} from '../core/dtos'
import { DeliveryPartnerEntity } from '../core/entities'
import { DeliveryPartnerService } from '../services/delivery-partner.service'

@injectable()
@Controller('/delivery-partners')
export class DeliveryPartnerController {
  constructor(
    private readonly deliveryPartnerService: DeliveryPartnerService
  ) {}

  @Post('/')
  async createDeliveryPartner(
    @Body() deliveryPartner: CreateDeliveryPartnerDto
  ): Promise<DeliveryPartnerResponseDto> {
    return await this.deliveryPartnerService.createDeliveryPartner(
      deliveryPartner
    )
  }

  @Get('/')
  async getDeliveryPartners(
    @QueryParams() query: QueryGetDeliveryPartnersDto
  ): Promise<DeliveryPartnerResponseDto[]> {
    const filter: Partial<DeliveryPartnerEntity> = {
      name: query.name,
      serviceType: query.serviceType,
      contactPhone: query.contactPhone,
    }

    return await this.deliveryPartnerService.getListDeliveryPartner(filter, query)
  }

  @Get('/:id')
  async getDeliveryPartner(
    @Param('id') id: string
  ): Promise<DeliveryPartnerResponseDto> {
    return await this.deliveryPartnerService.getDeliveryPartnerById(id)
  }

  @Patch('/:id')
  async updateDeliveryPartner(
    @Param('id') id: string,
    @Body() deliveryPartner: UpdateDeliveryPartnerDto
  ): Promise<DeliveryPartnerResponseDto> {
    return await this.deliveryPartnerService.updateDeliveryPartner(
      id,
      deliveryPartner
    )
  }

  @Delete('/:id')
  async deleteDeliveryPartner(@Param('id') id: string): Promise<boolean> {
    return await this.deliveryPartnerService.deleteDeliveryPartner(id)
  }
}
