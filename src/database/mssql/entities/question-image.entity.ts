import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm'

import { Image } from './image.entity'
import { Question } from './question.entity'

@Entity('question_image')
@Unique(['imageId', 'questionId'])
export class QuestionImage {
  @PrimaryColumn('uuid')
  imageId: string

  @PrimaryColumn('uuid')
  questionId: string

  @ManyToOne(() => Image, (image) => image.questionImages)
  @JoinColumn({ name: 'image_id' })
  image?: Image

  @ManyToOne(() => Question, (question) => question.questionImages)
  @JoinColumn({ name: 'question_id' })
  question?: Question
}
