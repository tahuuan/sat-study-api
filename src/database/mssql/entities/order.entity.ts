import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

import { Status } from '../../../config/enums'

import { BaseEntity } from './base.entity'
import { Customer } from './customer.entity'
import { Shipment } from './shipment.entity'
import { Warehouse } from './warehouse.entity'

@Entity()
export class Order extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 50, enum: Status })
  status: Status

  @Column()
  orderDate: Date

  @Column()
  totalAmount: number

  @Index()
  @Column()
  customerId: string

  @ManyToOne(() => Customer, customer => customer.id)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @Column({ type: 'uuid' })
  warehouseId: string

  @ManyToOne(() => Warehouse, warehouse => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse

  @Column({ type: 'uuid', nullable: true })
  shipmentId: string

  @OneToOne(() => Shipment, shipment => shipment.id)
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment
}
