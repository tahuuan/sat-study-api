import { Status } from '../../../config/enums'

export interface OrderNode {
  id: string
  status: Status
  orderDate: Date
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export class Order implements OrderNode {
  id: string
  status: Status
  orderDate: Date
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  constructor(data: Partial<OrderNode>) {
    this.id = data.id ?? crypto.randomUUID()
    this.status = data.status ?? Status.PENDING
    this.orderDate = data.orderDate ?? new Date()
    this.totalAmount = data.totalAmount ?? 0
    this.createdAt = data.createdAt ?? new Date()
    this.updatedAt = data.updatedAt ?? new Date()
    this.deletedAt = data.deletedAt
  }

  toNode(): OrderNode {
    return {
      id: this.id,
      status: this.status,
      orderDate: this.orderDate,
      totalAmount: this.totalAmount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    }
  }
}
