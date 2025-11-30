import { BaseEntity } from './base.entity'
import { QuestionEntity } from './question.entity'
import { TestTemplateModuleEntity } from './test-template-module.entity'

export class TestTemplateQuestionEntity extends BaseEntity {
  testTemplateModuleId: string
  questionId: string
  order?: number

  testTemplateModule?: TestTemplateModuleEntity
  question?: QuestionEntity
}