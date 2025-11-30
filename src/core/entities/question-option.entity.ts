import { QuestionEntity } from './question.entity'

export class QuestionOptionEntity {
  questionId: string
  value?: string
  nameOption?: string

  question?: QuestionEntity
}