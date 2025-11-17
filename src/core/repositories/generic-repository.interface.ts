import { PageOptionsDto } from "../dtos/page-options.dto"

export interface IGenericRepository<TDomainEntity> {
  find: (
    condition: Partial<{
      [K in keyof TDomainEntity]: TDomainEntity[K] | TDomainEntity[K][];
    }>,
    query?: PageOptionsDto
  ) => Promise<TDomainEntity[]>

  count: (
    condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>
  ) => Promise<number>

  findOne: (
    condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>,
    orderOptions?: Partial<{
      [K in keyof TDomainEntity]: 'ASC' | 'DESC';
    }>
  ) => Promise<TDomainEntity | null>

  create: (entity: Partial<TDomainEntity>) => Promise<TDomainEntity>

  createMany: (entities: Partial<TDomainEntity>[]) => Promise<TDomainEntity[]>

  update: (
    id: string,
    entity: Partial<TDomainEntity>
  ) => Promise<TDomainEntity>

  delete: (id: string) => Promise<void>

  deleteByCondition: (
    condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>
  ) => Promise<void>

  softDelete: (id: string) => Promise<void>

  upsertMany: (
    entities: Partial<TDomainEntity>[],
    options: {
      conflictPaths: string[] | { [P in keyof TDomainEntity]?: true }
      skipUpdateIfNoValuesChanged?: boolean
    }
  ) => Promise<void>
}