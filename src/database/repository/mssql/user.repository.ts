import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { UserEntity } from '../../../core/entities'
import { User } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class UserRepository extends GenericRepository<UserEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(User)

    const toDomainEntity = (ormEntity: User): UserEntity => {
      return {
        userId: ormEntity.userId,
        firstName: ormEntity.firstName,
        lastName: ormEntity.lastName,
        email: ormEntity.email,
        status: ormEntity.status,
        password: ormEntity.password,
        role: ormEntity.role,
        rdWtScore: ormEntity.rdWtScore,
        mathScore: ormEntity.mathScore,
        phoneNumber: ormEntity.phoneNumber,
        totalScore: ormEntity.totalScore,
        certification: ormEntity.certification,
        specialty: ormEntity.specialty,
        userSettings: ormEntity.userSettings
          ? {
              userId: ormEntity.userSettings.userId,
              mathScoreGoal: ormEntity.userSettings.mathScoreGoal,
              rdWtScoreGoal: ormEntity.userSettings.rdWtScoreGoal,
              nextTestDate: ormEntity.userSettings.nextTestDate,
            }
          : undefined,
        userActivity: ormEntity.userActivity
          ? {
              userId: ormEntity.userActivity.userId,
              recentDate: ormEntity.userActivity.recentDate,
              activeSecond: ormEntity.userActivity.activeSecond,
              streak: ormEntity.userActivity.streak,
            }
          : undefined,
        userSubscriptions: ormEntity.userSubscriptions?.map((sub) => ({
          userId: sub.userId,
          subscriptionId: sub.subscriptionId,
          status: sub.status,
          paymentLink: sub.paymentLink,
          cancelledAt: sub.cancelledAt,
          cancelReason: sub.cancelReason,
        })),
      }
    }

    super(repository, toDomainEntity)
  }
}
