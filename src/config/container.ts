import { container } from 'tsyringe'

import { CustomerController } from '../controllers/crud-customer.controller'
import { DeliveryPartnerController } from '../controllers/crud-delivery-partner.controller'
import { EmployeeController } from '../controllers/crud-employee.controller'
import { OrderController } from '../controllers/crud-order.controller'
import { ProductController } from '../controllers/crud-product.controller'
import { ShipmentController } from '../controllers/crud-shipment.controller'
import { SupplierController } from '../controllers/crud-supplier.controller'
import { WarehouseController } from '../controllers/crud-warehouse.controller'
import { CustomerService } from '../services/customer.service'
import { DeliveryPartnerService } from '../services/delivery-partner.service'
import { EmployeeService } from '../services/employee.service'
import { OrderService } from '../services/order.service'
import { ProductService } from '../services/product.service'
import { ShipmentService } from '../services/shipment.service'
import { SupplierService } from '../services/supplier.service'
import { WarehouseService } from '../services/warehouse.service'

import { SERVICE_INJECTION_TOKEN } from './enums'

// // Register services
container.register(SERVICE_INJECTION_TOKEN.CUSTOMER, {
  useClass: CustomerService,
})
container.register(SERVICE_INJECTION_TOKEN.PRODUCT, {
  useClass: ProductService,
})
container.register(SERVICE_INJECTION_TOKEN.WAREHOUSE, {
  useClass: WarehouseService,
})
container.register(SERVICE_INJECTION_TOKEN.SUPPLIER, {
  useClass: SupplierService,
})
container.register(SERVICE_INJECTION_TOKEN.DELIVERY_PARTNER, {
  useClass: DeliveryPartnerService,
})
container.register(SERVICE_INJECTION_TOKEN.SHIPMENT, {
  useClass: ShipmentService,
})
container.register(SERVICE_INJECTION_TOKEN.EMPLOYEE, {
  useClass: EmployeeService,
})
container.register(SERVICE_INJECTION_TOKEN.ORDER, {
  useClass: OrderService,
})

// Register controllers
container.register(CustomerController, {
  useClass: CustomerController,
})
container.register(ProductController, {
  useClass: ProductController,
})
container.register(WarehouseController, {
  useClass: WarehouseController,
})
container.register(SupplierController, {
  useClass: SupplierController,
})
container.register(DeliveryPartnerController, {
  useClass: DeliveryPartnerController,
})
container.register(ShipmentController, {
  useClass: ShipmentController,
})
container.register(EmployeeController, {
  useClass: EmployeeController,
})
container.register(OrderController, {
  useClass: OrderController,
})


export { container }
