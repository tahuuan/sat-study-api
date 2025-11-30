import { injectable } from 'tsyringe'

import { appDataSource } from '../../../config/database/mssql/db.config'
import { UserNoteEntity } from '../../../core/entities'
import { UserNote } from '../../mssql/entities'

import { GenericRepository } from './generic-repository'

@injectable()
export class UserNoteRepository extends GenericRepository<UserNoteEntity>() {
  constructor() {
    const repository = appDataSource.getRepository(UserNote)

    const toDomainEntity = (ormEntity: UserNote): UserNoteEntity => {
      return {
        lessonContentId: ormEntity.lessonContentId,
        userId: ormEntity.userId,
        content: ormEntity.content,
        color: ormEntity.color,
      }
    }

    super(repository, toDomainEntity)
  }
}
