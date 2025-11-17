import { ShipmentEntity } from '../entities'

import { IGenericRepository } from './generic-repository.interface'

export type IShipmentRepository = IGenericRepository<ShipmentEntity>
