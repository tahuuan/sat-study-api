import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm'

import { Order } from './order.entity'
import { Product } from './product.entity'

@Unique(['orderId', 'productId'])
@Entity()
export class OrderDetail {
  @Index()
  @Column({ type: 'uuid' })
  orderId: string

  @PrimaryColumn({ type: 'uuid' })
  productId: string

  @ManyToOne(() => Order, order => order.id)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product
}
