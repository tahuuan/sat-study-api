import 'reflect-metadata'
import cors from 'cors'
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked'

import { App } from './app'
import {
  appDataSource,
  initializeDatabase,
  registerRepositories,
} from './config/database/mssql/db.config'
import { CustomerController } from './controllers/crud-customer.controller'
import { DeliveryPartnerController } from './controllers/crud-delivery-partner.controller'
import { EmployeeController } from './controllers/crud-employee.controller'
import { OrderController } from './controllers/crud-order.controller'
import { ProductController } from './controllers/crud-product.controller'
import { ShipmentController } from './controllers/crud-shipment.controller'
import { SupplierController } from './controllers/crud-supplier.controller'
import { WarehouseController } from './controllers/crud-warehouse.controller'
import { CustomerService } from './services/customer.service'
import { DeliveryPartnerService } from './services/delivery-partner.service'
import { EmployeeService } from './services/employee.service'
import { OrderService } from './services/order.service'
import { ProductService } from './services/product.service'
import { ShipmentService } from './services/shipment.service'
import { SupplierService } from './services/supplier.service'
import { WarehouseService } from './services/warehouse.service'

const main = async (): Promise<void> => {
  // Config CORS
  const corsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }

  // Initialize database first
  await initializeDatabase()

  // Initialize transactional context
  initializeTransactionalContext()
  patchTypeORMRepositoryWithBaseRepository()

  // Set the data source for transactions
  await appDataSource.manager.connection.driver.afterConnect()

  registerRepositories()

  const app = new App()
  app.app.use(cors(corsOptions))
  app.setControllers([
    CustomerController,
    ProductController,
    WarehouseController,
    SupplierController,
    DeliveryPartnerController,
    ShipmentController,
    EmployeeController,
    OrderController,
  ])
  app.setServices([
    CustomerService,
    ProductService,
    WarehouseService,
    SupplierService,
    DeliveryPartnerService,
    ShipmentService,
    EmployeeService,
    OrderService,
  ])

  const PORT = 3000
  app.app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT.toString()}`)
  })
}

void main().catch(console.error)
