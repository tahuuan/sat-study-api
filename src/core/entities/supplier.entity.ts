import { BaseEntity } from "./base.entity"
import { SupplierProductEntity } from "./supplier-product.entity"

export class SupplierEntity extends BaseEntity {
  name: string

  country: string

  contactPhone: string

  contactEmail: string

  supplierProducts: SupplierProductEntity[]
}
