import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { ENUM_TEST_TYPE } from '../../../config/enums/session.enum'

import { TestTemplateModule } from './test-template-module.entity'

@Entity('test_template')
export class TestTemplate {
  @PrimaryGeneratedColumn('uuid')
  testTemplateId: string

  @Column({ type: 'int', generated: 'increment' })
  sequenceId: number

  @Column({ type: 'varchar', length: 20, generatedType: 'STORED', asExpression: "'TPL' + RIGHT('0000' + CAST(sequence_id AS VARCHAR), 4)", insert: false, update: false })
  templateCode: string

  @Column({ type: 'bit', nullable: false, default: false })
  isPublic: boolean

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  topic: string

  @Column({ type: 'varchar', enum: ENUM_TEST_TYPE, nullable: true })
  testType: ENUM_TEST_TYPE

  @Column({ type: 'varchar', length: 100, nullable: true })
  contentTier: string

  @OneToMany(() => TestTemplateModule, (testTemplateModule) => testTemplateModule.testTemplate)
  testTemplateModules: TestTemplateModule[]
}
