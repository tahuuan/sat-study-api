import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'

import { EmployeeType } from '../../../config/enums'

import { BaseEntity } from './base.entity'
import { Warehouse } from './warehouse.entity'

@Entity()
export class Employee extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  email: string

  @Column({ type: 'varchar', length: 255 })
  phoneNumber: string

  @Column({ type: 'varchar', length: 255, enum: EmployeeType, default: EmployeeType.STAFF })
  type: EmployeeType

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number

  @Index()
  @Column({ type: 'uuid' })
  warehouseId: string

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse
}
