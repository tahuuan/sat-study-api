import {
  DeepPartial,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { UpsertOptions } from 'typeorm/repository/UpsertOptions'

import { PageOptionsDto } from '../../../core/dtos/page-options.dto'
import { IGenericRepository } from '../../../core/repositories/generic-repository.interface'

class NotFoundException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundException'
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type<T = any> = new (...args: any[]) => T

 
export function GenericRepository<TDomainEntity extends ObjectLiteral>(): Type<
  IGenericRepository<TDomainEntity>
> {
  class DataServiceHost<TOrmModel extends ObjectLiteral>
    implements IGenericRepository<TDomainEntity>
  {
    constructor(
      protected readonly repository: Repository<TOrmModel>,
      protected readonly toDomainEntity: (entity: TOrmModel) => TDomainEntity
    ) {}

    async find(
      condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>,
      pageOptions?: PageOptionsDto
    ): Promise<TDomainEntity[]> {
      const ormEntities = await this.repository.find({
        where: condition as unknown as FindOptionsWhere<TOrmModel>,
        take: pageOptions?.take ?? 100,
        skip: pageOptions?.skip ?? 0,
        order: {
          ...(pageOptions?.sort
            ? { [pageOptions.sort]: pageOptions.sortDirection ?? 'ASC' }
            : {}),
        } as unknown as FindOptionsOrder<TOrmModel>,
      })
      return ormEntities.map(this.toDomainEntity)
    }

    async count(
      condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>
    ): Promise<number> {
      return await this.repository.count({
        where: condition as unknown as FindOptionsWhere<TOrmModel>,
      })
    }

    async findOne(
      condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>,
      orderOptions?: {
        [K in keyof TDomainEntity]: 'ASC' | 'DESC'
      }
    ): Promise<TDomainEntity | null> {
      const ormModel = await this.repository.findOne({
        where: condition as unknown as FindOptionsWhere<TOrmModel>,
        order: (orderOptions ?? {}) as unknown as FindOptionsOrder<TOrmModel>,
      })

      if (!ormModel) {
        return null
      }

      return this.toDomainEntity(ormModel)
    }

    async create(entity: Partial<TDomainEntity>): Promise<TDomainEntity> {
      const ormModel = this.repository.create(
        entity as unknown as DeepPartial<TOrmModel>
      )
      const savedOrmEntity = await this.repository.save(ormModel)

      return this.toDomainEntity(savedOrmEntity)
    }

    async createMany(
      entities: Partial<TDomainEntity>[]
    ): Promise<TDomainEntity[]> {
      const ormModels = this.repository.create(
        entities as unknown as DeepPartial<TOrmModel>[]
      )
      const savedOrmEntities = await this.repository.save(ormModels)

      return savedOrmEntities.map(this.toDomainEntity)
    }

    async update(
      id: string,
      entity: Partial<TDomainEntity>
    ): Promise<TDomainEntity> {
      const condition = { id } as unknown as FindOptionsWhere<TOrmModel>
      const ormModel = await this.repository.findOne({ where: condition })

      if (!ormModel) {
        throw new NotFoundException(
          `${this.repository.metadata.name} entity with id ${id} not found`
        )
      }

      const updatedOrmEntity = { ...ormModel, ...entity }
      const savedOrmEntity = await this.repository.save(updatedOrmEntity)

      return this.toDomainEntity(savedOrmEntity)
    }

    async delete(id: string): Promise<void> {
      const condition = { id } as unknown as FindOptionsWhere<TOrmModel>
      const ormModel = await this.repository.findOne({ where: condition })

      if (!ormModel) {
        throw new NotFoundException(
          `${this.repository.metadata.name} entity with id ${id} not found`
        )
      }

      await this.repository.delete(condition)
    }

    async deleteByCondition(
      condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>
    ): Promise<void> {
      await this.repository.delete(
        condition as unknown as FindOptionsWhere<TOrmModel>
      )
    }

    async softDelete(id: string): Promise<void> {
      const condition = { id } as unknown as FindOptionsWhere<TOrmModel>
      const ormModel = await this.repository.findOne({ where: condition })

      if (!ormModel) {
        throw new NotFoundException(
          `${this.repository.metadata.name} entity with id ${id} not found`
        )
      }

      const softDeletedOrmEntity = { ...ormModel, deletedAt: new Date() }

      await this.repository.update(id, softDeletedOrmEntity)
    }

    async upsertMany(
      entities: Partial<TDomainEntity>[],
      options: {
        conflictPaths: string[] | { [P in keyof TDomainEntity]?: true }
        skipUpdateIfNoValuesChanged?: boolean
      }
    ): Promise<void> {
      await this.repository.upsert(
        entities as unknown as QueryDeepPartialEntity<TOrmModel>[],
        options as unknown as UpsertOptions<TOrmModel>
      )
    }
  }

  return DataServiceHost
}
