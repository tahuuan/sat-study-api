import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm'

import { Product } from './product.entity'
import { Warehouse } from './warehouse.entity'

@Unique(['warehouseId', 'productId'])
@Entity()
export class Store {
  @Column({ type: 'uuid' })
  warehouseId: string

  @PrimaryColumn({ type: 'uuid' })
  productId: string

  @ManyToOne(() => Warehouse, warehouse => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product
}
