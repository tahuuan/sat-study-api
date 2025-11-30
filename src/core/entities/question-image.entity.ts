import { ImageEntity } from "./image.entity"
import { QuestionEntity } from "./question.entity"

export class QuestionImageEntity {
  imageId: string

  questionId: string

  image?: ImageEntity
  
  question?: QuestionEntity
}