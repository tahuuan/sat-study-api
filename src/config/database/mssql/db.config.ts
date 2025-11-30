import { container } from 'tsyringe'
import { DataSource } from 'typeorm'

import { REPOSITORY_INJECTION_TOKEN } from '../../../config/enums'
import {
  Chapter,
  Image,
  Lesson,
  LessonContent,
  MissionTask,
  MissionTaskItem,
  MissionTaskMissionItemMap,
  Question,
  QuestionImage,
  QuestionOption,
  Subscription,
  TestSession,
  TestSessionQuestion,
  TestTemplate,
  TestTemplateModule,
  TestTemplateQuestion,
  User,
  UserActivity,
  UserMissionTaskItem,
  UserNote,
  UserSettings,
  UserSubscriptionMap,
} from '../../../database/mssql/entities'
import {
  ChapterRepository,
  ImageRepository,
  LessonContentRepository,
  LessonRepository,
  MissionTaskItemRepository,
  MissionTaskMissionItemMapRepository,
  MissionTaskRepository,
  QuestionImageRepository,
  QuestionOptionRepository,
  QuestionRepository,
  SubscriptionRepository,
  TestSessionQuestionRepository,
  TestSessionRepository,
  TestTemplateModuleRepository,
  TestTemplateQuestionRepository,
  TestTemplateRepository,
  UserActivityRepository,
  UserNoteRepository,
  UserRepository,
  UserSettingsRepository,
  UserSubscriptionMapRepository,
} from '../../../database/repository/mssql'
import { NamingStrategy } from '../../naming.strategy'

export const appDataSource = new DataSource({
  type: 'mssql',
  host: process.env.MSSQL_HOST ?? 'localhost',
  port: Number(process.env.MSSQL_PORT ?? '1433'),
  username: process.env.MSSQL_USERNAME ?? 'sa',
  password: process.env.MSSQL_PASSWORD ?? 'Admin@123',
  database: process.env.MSSQL_DATABASE ?? 'master',
  options: { trustServerCertificate: true },
  synchronize: false,
  logging: false,
  entities: [
    User,
    UserSettings,
    UserActivity,
    Subscription,
    UserSubscriptionMap,
    Chapter,
    Lesson,
    LessonContent,
    UserNote,
    MissionTask,
    MissionTaskItem,
    MissionTaskMissionItemMap,
    UserMissionTaskItem,
    TestSession,
    TestSessionQuestion,
    Question,
    QuestionOption,
    QuestionImage,
    Image,
    TestTemplate,
    TestTemplateModule,
    TestTemplateQuestion
  ],
  subscribers: [],
  migrations: ['src/database/mssql/migrations/*.ts'],
  migrationsTableName: '__migrations',
  namingStrategy: new NamingStrategy(),
})

export const initializeDatabase = async (): Promise<void> => {
  await appDataSource.initialize()
}

export const registerRepositories = (): void => {
  container.register(REPOSITORY_INJECTION_TOKEN.USER, {
    useClass: UserRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.USER_SETTINGS, {
    useClass: UserSettingsRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.USER_ACTIVITY, {
    useClass: UserActivityRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.CHAPTER, {
    useClass: ChapterRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.LESSON, {
    useClass: LessonRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.LESSON_CONTENT, {
    useClass: LessonContentRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.QUESTION, {
    useClass: QuestionRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.QUESTION_OPTION, {
    useClass: QuestionOptionRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.QUESTION_IMAGE, {
    useClass: QuestionImageRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.IMAGE, {
    useClass: ImageRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.TEST_SESSION, {
    useClass: TestSessionRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.TEST_SESSION_QUESTION, {
    useClass: TestSessionQuestionRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.TEST_TEMPLATE, {
    useClass: TestTemplateRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.TEST_TEMPLATE_MODULE, {
    useClass: TestTemplateModuleRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.TEST_TEMPLATE_QUESTION, {
    useClass: TestTemplateQuestionRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.MISSION_TASK, {
    useClass: MissionTaskRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.MISSION_TASK_ITEM, {
    useClass: MissionTaskItemRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.MISSION_TASK_MISSION_ITEM_MAP, {
    useClass: MissionTaskMissionItemMapRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.SUBSCRIPTION, {
    useClass: SubscriptionRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.USER_SUBSCRIPTION_MAP, {
    useClass: UserSubscriptionMapRepository,
  })
  container.register(REPOSITORY_INJECTION_TOKEN.USER_NOTE, {
    useClass: UserNoteRepository,
  })
}
