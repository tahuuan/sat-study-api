import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Question } from './question.entity'
import { TestTemplateModule } from './test-template-module.entity'

@Entity('test_template_question')
export class TestTemplateQuestion extends BaseEntity {
  @Column('uuid')
  testTemplateModuleId: string

  @Column('uuid')
  questionId: string

  @Column({ type: 'int', nullable: true })
  order: number

  @ManyToOne(() => TestTemplateModule, (testTemplateModule) => testTemplateModule.testTemplateQuestions)
  @JoinColumn({ name: 'test_template_module_id' })
  testTemplateModule?: TestTemplateModule

  @ManyToOne(() => Question, (question) => question.testTemplateQuestions)
  @JoinColumn({ name: 'question_id' })
  question?: Question
}
