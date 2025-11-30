import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { UserSubscriptionMapEntity } from '../../../core/entities'
import { UserSubscriptionMap } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class UserSubscriptionMapRepository extends GenericRepository<UserSubscriptionMapEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(UserSubscriptionMap)

    const toDomainEntity = (ormEntity: UserSubscriptionMap): UserSubscriptionMapEntity => {
      return {
        userId: ormEntity.userId,
        subscriptionId: ormEntity.subscriptionId,
        status: ormEntity.status,
        paymentLink: ormEntity.paymentLink,
        cancelledAt: ormEntity.cancelledAt,
        cancelReason: ormEntity.cancelReason,
      }
    }

    super(repository, toDomainEntity)
  }
}
