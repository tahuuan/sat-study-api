import { ENUM_QUESTION_DIFFICULTY, ENUM_QUESTION_KIND, ENUM_QUESTION_STATUS, ENUM_TYPE } from '../../config/enums'

import { BaseEntity } from './base.entity'
import { QuestionImageEntity } from './question-image.entity'
import { QuestionOptionEntity } from './question-option.entity'
import { TestSessionQuestionEntity } from './test-session-question.entity'
import { TestTemplateQuestionEntity } from './test-template-question.entity'
import { UserEntity } from './user.entity'

export class QuestionEntity extends BaseEntity {
  status: ENUM_QUESTION_STATUS
  questionText?: string
  correctAnswer?: string
  difficulty?: ENUM_QUESTION_DIFFICULTY
  explanation?: string
  kind: ENUM_QUESTION_KIND
  type?: ENUM_TYPE
  tutorId?: string

  tutor?: UserEntity
  questionOptions?: QuestionOptionEntity[]
  questionImages?: QuestionImageEntity[]
  testSessionQuestions?: TestSessionQuestionEntity[]
  testTemplateQuestions?: TestTemplateQuestionEntity[]
}