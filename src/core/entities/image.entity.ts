import { BaseEntity } from './base.entity'
import { QuestionImageEntity } from './question-image.entity'

export class ImageEntity extends BaseEntity {
  data?: string
  width?: number
  height?: number
  checksum?: string

  questionImages?: QuestionImageEntity[]
}