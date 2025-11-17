export class BaseEntityWithoutId {
  createdAt?: Date

  updatedAt?: Date
}

export class BaseEntity extends BaseEntityWithoutId {
  id: string
}