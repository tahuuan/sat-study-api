import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { ENUM_CONTENT_TYPE } from '../../../config/enums/lesson.enum'

import { BaseEntity } from './base.entity'
import { Lesson } from './lesson.entity'
import { UserNote } from './user-note.entity'

@Entity('lesson_content')
export class LessonContent extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  content: string

  @Column({ type: 'varchar', enum: ENUM_CONTENT_TYPE, nullable: true })
  type: ENUM_CONTENT_TYPE

  @Column({ type: 'uuid', nullable: true })
  contentParentId: string

  @Column({ type: 'uuid', nullable: false })
  lessonId: string

  @Column({ type: 'int', nullable: true })
  order: number

  @ManyToOne(() => Lesson, (lesson) => lesson.lessonContents)
  @JoinColumn({ name: 'lesson_id' })
  lesson?: Lesson

  @OneToMany(() => UserNote, (userNote) => userNote.lessonContent)
  userNotes?: UserNote[]
}
