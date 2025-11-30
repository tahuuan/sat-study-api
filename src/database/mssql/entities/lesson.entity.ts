import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Chapter } from './chapter.entity'
import { LessonContent } from './lesson-content.entity'

@Entity('lesson')
export class Lesson extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  subTitle: string

  @Column({ type: 'uuid', nullable: true })
  previousLessonId: string

  @JoinColumn({ name: 'previous_lesson_id' })
  @OneToOne(() => Lesson, { nullable: true })
  previousLesson?: Lesson

  @Column({ type: 'uuid', nullable: true })
  nextLessonId: string

  @JoinColumn({ name: 'next_lesson_id' })
  @OneToOne(() => Lesson, { nullable: true })
  nextLesson?: Lesson

  @Column({ type: 'uuid', nullable: false })
  chapterId: string

  @ManyToOne(() => Chapter, (chapter) => chapter.lessons)
  @JoinColumn({ name: 'chapter_id' })
  chapter?: Chapter

  @OneToMany(() => LessonContent, (lessonContent) => lessonContent.lesson)
  lessonContents?: LessonContent[]
}
