import { ProductEntity } from './product.entity'

export class OrderDetailEntity {
  orderId: string

  productId: string

  product: ProductEntity
}
