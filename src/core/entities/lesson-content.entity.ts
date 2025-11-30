import { ENUM_CONTENT_TYPE } from '../../config/enums/lesson.enum'

import { BaseEntity } from './base.entity'
import { LessonEntity } from './lesson.entity'
import { UserNoteEntity } from './user-note.entity'

export class LessonContentEntity extends BaseEntity {
  content?: string
  type?: ENUM_CONTENT_TYPE
  contentParentId?: string
  lessonId: string
  order?: number

  lesson?: LessonEntity
  userNotes?: UserNoteEntity[]
}