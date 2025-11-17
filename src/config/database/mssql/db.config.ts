import { container } from 'tsyringe'
import { DataSource } from 'typeorm'

import { REPOSITORY_INJECTION_TOKEN } from '../../../config/enums'
import {
  DeliveryPartner,
  Employee,
  OrderDetail,
  Product,
  Shipment,
  Store,
  Supplier,
  SupplierProduct,
  Warehouse,
} from '../../../database/mssql/entities'
import { Customer } from '../../../database/mssql/entities/customer.entity'
import { Order } from '../../../database/mssql/entities/order.entity'
import {
  CustomerRepository,
  DeliveryPartnerRepository,
  EmployeeRepository,
  OrderDetailRepository,
  OrderRepository,
  ProductRepository,
  ShipmentRepository,
  StoreRepository,
  SupplierProductRepository,
  SupplierRepository,
  WarehouseRepository,
} from '../../../database/repository/mssql'
import { NamingStrategy } from '../../naming.strategy'

export const appDataSource = new DataSource({
  type: 'mssql',
  host: process.env.MSSQL_HOST ?? 'localhost',
  port: Number(process.env.MSSQL_PORT ?? '1433'),
  username: process.env.MSSQL_USERNAME ?? 'sa',
  password: process.env.MSSQL_PASSWORD ?? 'Admin@123',
  database: process.env.MSSQL_DATABASE ?? 'master',
  options: { trustServerCertificate: true },
  synchronize: false,
  logging: false,
  entities: [
    Customer,
    Order,
    Product,
    OrderDetail,
    Supplier,
    SupplierProduct,
    Warehouse,
    Store,
    Shipment,
    DeliveryPartner,
    Employee,
  ],
  subscribers: [],
  migrations: ['src/database/mssql/migrations/*.ts'],
  migrationsTableName: '__migrations',
  namingStrategy: new NamingStrategy(),
})

export const initializeDatabase = async (): Promise<void> => {
  await appDataSource.initialize()
}

export const registerRepositories = (): void => {
  container.register(REPOSITORY_INJECTION_TOKEN.CUSTOMER, {
    useClass: CustomerRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.ORDER, {
    useClass: OrderRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.PRODUCT, {
    useClass: ProductRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.SHIPMENT, {
    useClass: ShipmentRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.WAREHOUSE, {
    useClass: WarehouseRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.STORE, {
    useClass: StoreRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.SUPPLIER_PRODUCT, {
    useClass: SupplierProductRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.SUPPLIER, {
    useClass: SupplierRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.DELIVERY_PARTNER, {
    useClass: DeliveryPartnerRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.ORDER_DETAIL, {
    useClass: OrderDetailRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.EMPLOYEE, {
    useClass: EmployeeRepository,
  })
}
