import { ENUM_QUESTION_DIFFICULTY } from '../../config/enums'

import { BaseEntity } from './base.entity'
import { ChapterEntity } from './chapter.entity'
import { TestTemplateQuestionEntity } from './test-template-question.entity'
import { TestTemplateEntity } from './test-template.entity'

export class TestTemplateModuleEntity extends BaseEntity {
  difficulty?: ENUM_QUESTION_DIFFICULTY
  name?: string
  type?: string
  totalQuestion?: number
  timeLimitSecond?: number
  testTemplateId?: string
  chapterId?: string

  testTemplate?: TestTemplateEntity
  chapter?: ChapterEntity
  testTemplateQuestions?: TestTemplateQuestionEntity[]
}