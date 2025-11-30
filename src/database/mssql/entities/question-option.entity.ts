import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm'

import { Question } from './question.entity'

@Entity('question_option')
@Unique(['questionId', 'nameOption'])
export class QuestionOption{
  @PrimaryColumn('uuid')
  @Column({ type: 'uuid', nullable: false })
  questionId: string

  @Column({ type: 'varchar', length: 10, nullable: true })
  value: string

  @PrimaryColumn({ type: 'varchar', length: 500 })
  nameOption: string

  @ManyToOne(() => Question, (question) => question.questionOptions)
  @JoinColumn({ name: 'question_id' })
  question?: Question
}
