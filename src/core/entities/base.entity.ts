export class EntityWithId {
  id: string
}

export class BaseEntity extends EntityWithId {
  createdAt?: Date

  updatedAt?: Date

  deletedAt?: Date
}