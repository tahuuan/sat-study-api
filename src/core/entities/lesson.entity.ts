import { BaseEntity } from './base.entity'
import { ChapterEntity } from './chapter.entity'
import { LessonContentEntity } from './lesson-content.entity'

export class LessonEntity extends BaseEntity {
  title: string
  subTitle?: string
  previousLessonId?: string
  nextLessonId?: string
  chapterId: string

  previousLesson?: LessonEntity
  nextLesson?: LessonEntity
  chapter?: ChapterEntity
  lessonContents?: LessonContentEntity[]
}