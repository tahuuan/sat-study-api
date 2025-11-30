import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { ImageEntity } from '../../../core/entities'
import { Image } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class ImageRepository extends GenericRepository<ImageEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(Image)

    const toDomainEntity = (ormEntity: Image): ImageEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        data: ormEntity.data,
        width: ormEntity.width,
        height: ormEntity.height,
        checksum: ormEntity.checksum,
      }
    }

    super(repository, toDomainEntity)
  }
}
