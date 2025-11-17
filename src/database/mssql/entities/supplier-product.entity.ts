import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm'

import { Product } from './product.entity'
import { Supplier } from './supplier.entity'

@Unique(['supplierId', 'productId'])
@Entity()
export class SupplierProduct {
  @Column({ type: 'uuid' })
  supplierId: string

  @PrimaryColumn({ type: 'uuid' })
  productId: string

  @ManyToOne(() => Supplier, supplier => supplier.id)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product
}
