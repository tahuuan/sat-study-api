import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { SubscriptionEntity } from '../../../core/entities'
import { Subscription } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class SubscriptionRepository extends GenericRepository<SubscriptionEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(Subscription)

    const toDomainEntity = (ormEntity: Subscription): SubscriptionEntity => {
      return {
        id: ormEntity.id,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        deletedAt: ormEntity.deletedAt,
        description: ormEntity.description,
        name: ormEntity.name,
        type: ormEntity.type,
        isActive: ormEntity.isActive,
        price: ormEntity.price,
        duration: ormEntity.duration,
        userSubscriptions: ormEntity.userSubscriptions?.map((us) => ({
          userId: us.userId,
          subscriptionId: us.subscriptionId,
          status: us.status,
          paymentLink: us.paymentLink,
          cancelledAt: us.cancelledAt,
          cancelReason: us.cancelReason,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
