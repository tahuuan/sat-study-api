export interface CustomerNode {
  id: string
  name: string
  email?: string
  address?: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export class Customer implements CustomerNode {
  id: string
  name: string
  email?: string
  address?: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  constructor(data: Partial<CustomerNode>) {
    this.id = data.id ?? crypto.randomUUID()
    this.name = data.name ?? ''
    this.email = data.email
    this.address = data.address
    this.phoneNumber = data.phoneNumber
    this.createdAt = data.createdAt ?? new Date()
    this.updatedAt = data.updatedAt ?? new Date()
    this.deletedAt = data.deletedAt
  }

  toNode(): CustomerNode {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      address: this.address,
      phoneNumber: this.phoneNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    }
  }
}
