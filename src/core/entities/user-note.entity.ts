import { LessonContentEntity } from './lesson-content.entity'
import { UserEntity } from './user.entity'

export class UserNoteEntity {
  lessonContentId: string
  userId: string
  content?: string
  color?: string

  lessonContent?: LessonContentEntity
  user?: UserEntity
}