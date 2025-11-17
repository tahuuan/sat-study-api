import { Column, Entity, Index, OneToMany, VersionColumn } from 'typeorm'

import { ProductCategory } from '../../../config/enums'

import { BaseEntity } from './base.entity'
import { Store } from './store.entity'

@Entity()
export class Product extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Index()
  @Column({ type: 'varchar', length: 255, enum: ProductCategory })
  category: string

  @Column({ type: 'bit', default: 1 })
  isAvailable: boolean

  @VersionColumn({ default: 1 })
  version: number

  @OneToMany(() => Store, store => store.product)
  stores: Store[]
}
