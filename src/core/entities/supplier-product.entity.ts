import { SupplierEntity } from "./supplier.entity"

export class SupplierProductEntity {
  supplierId: string

  productId: string

  supplier: SupplierEntity
}
