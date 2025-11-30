import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntity } from './base.entity'
import { QuestionImage } from './question-image.entity'

@Entity('image')
export class Image extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  data: string

  @Column({ type: 'int', nullable: true })
  width: number

  @Column({ type: 'int', nullable: true })
  height: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  checksum: string

  @OneToMany(() => QuestionImage, (questionImage) => questionImage.image)
  questionImages?: QuestionImage[]
}
