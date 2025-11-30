import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm'

import { LessonContent } from './lesson-content.entity'
import { User } from './user.entity'

@Entity('user_note')
@Unique(['lessonContentId', 'userId'])
export class UserNote {
  @PrimaryColumn('uuid')
  lessonContentId: string

  @PrimaryColumn('uuid')
  userId: string

  @Column({ type: 'text', nullable: true })
  content: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string

  @ManyToOne(() => LessonContent, (lessonContent) => lessonContent.userNotes)
  @JoinColumn({ name: 'lesson_content_id' })
  lessonContent?: LessonContent

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User
}
