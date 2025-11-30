import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { ENUM_QUESTION_DIFFICULTY, ENUM_QUESTION_KIND, ENUM_QUESTION_STATUS, ENUM_TYPE } from '../../../config/enums'

import { BaseEntity } from './base.entity'
import { QuestionImage } from './question-image.entity'
import { QuestionOption } from './question-option.entity'
import { TestSessionQuestion } from './test-session-question.entity'
import { TestTemplateQuestion } from './test-template-question.entity'
import { User } from './user.entity'

@Entity('question')
export class Question extends BaseEntity {
  @Column({ type: 'varchar', enum: ENUM_QUESTION_STATUS, nullable: false, default: ENUM_QUESTION_STATUS.IN_REVIEW })
  status: ENUM_QUESTION_STATUS

  @Column({ type: 'text', nullable: true })
  questionText: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  correctAnswer: string

  @Column({ type: 'varchar', enum: ENUM_QUESTION_DIFFICULTY, nullable: true })
  difficulty: ENUM_QUESTION_DIFFICULTY

  @Column({ type: 'text', nullable: true })
  explanation: string

  @Column({ type: 'varchar', enum: ENUM_QUESTION_KIND, nullable: false, default: ENUM_QUESTION_KIND.MULTIPLE_CHOICE })
  kind: ENUM_QUESTION_KIND

  @Column({ type: 'varchar', enum: ENUM_TYPE, nullable: true })
  type: ENUM_TYPE

  @Column({ type: 'uuid', nullable: true })
  tutorId: string

  @ManyToOne(() => User, { nullable: true })
  tutor?: User

  @OneToMany(() => QuestionOption, (questionOption) => questionOption.question)
  questionOptions?: QuestionOption[]

  @OneToMany(() => QuestionImage, (questionImage) => questionImage.question)
  questionImages?: QuestionImage[]

  @OneToMany(() => TestSessionQuestion, (testSessionQuestion) => testSessionQuestion.question)
  testSessionQuestions?: TestSessionQuestion[]

  @OneToMany(() => TestTemplateQuestion, (testTemplateQuestion) => testTemplateQuestion.question)
  testTemplateQuestions?: TestTemplateQuestion[]
}
