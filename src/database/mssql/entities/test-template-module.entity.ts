import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { ENUM_QUESTION_DIFFICULTY } from '../../../config/enums'

import { BaseEntity } from './base.entity'
import { Chapter } from './chapter.entity'
import { TestTemplateQuestion } from './test-template-question.entity'
import { TestTemplate } from './test-template.entity'

@Entity('test_template_module')
export class TestTemplateModule extends BaseEntity {
  @Column({ type: 'varchar', enum: ENUM_QUESTION_DIFFICULTY, nullable: true })
  difficulty: ENUM_QUESTION_DIFFICULTY

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  type: string

  @Column({ type: 'int', nullable: true })
  totalQuestion: number

  @Column({ type: 'int', nullable: true })
  timeLimitSecond: number

  @Column({ type: 'uuid', nullable: true })
  testTemplateId: string

  @Column({ type: 'uuid', nullable: true })
  chapterId: string

  @ManyToOne(() => TestTemplate, (testTemplate) => testTemplate.testTemplateModules)
  @JoinColumn({ name: 'test_template_id' })
  testTemplate?: TestTemplate

  @ManyToOne(() => Chapter, (chapter) => chapter.testTemplateModules)
  @JoinColumn({ name: 'chapter_id' })
  chapter?: Chapter

  @OneToMany(() => TestTemplateQuestion, (testTemplateQuestion) => testTemplateQuestion.testTemplateModule)
  testTemplateQuestions?: TestTemplateQuestion[]
}
