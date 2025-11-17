import { Column, Entity } from 'typeorm'

import { BaseEntity } from './base.entity'

@Entity()
export class Supplier extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  country: string

  @Column({ type: 'varchar', length: 20 })
  contactPhone: string

  @Column({ type: 'varchar', length: 255 })
  contactEmail: string
}


// hàng điện tử 
// gia dụng: bàn ghế bút,
// quần áo:
// trái cây:
