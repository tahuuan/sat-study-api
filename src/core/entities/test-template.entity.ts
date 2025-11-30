import { ENUM_TEST_TYPE } from '../../config/enums/session.enum'

import { TestTemplateModuleEntity } from './test-template-module.entity'

export class TestTemplateEntity {
  testTemplateId: string
  isPublic: boolean
  name: string
  description?: string
  topic?: string
  testType?: ENUM_TEST_TYPE
  contentTier?: string

  testTemplateModules?: TestTemplateModuleEntity[]
}