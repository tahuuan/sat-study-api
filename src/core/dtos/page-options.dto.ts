import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

import { SortDirection } from '../../config/enums'

export class PageOptionsDto {
  @IsOptional()
  @IsString()
  sort?: string

  @IsEnum(SortDirection)
  @IsOptional()
  @IsString()
  sortDirection?: SortDirection

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  take: number

  get skip(): number {
    return this.page === 1 ? 0 : (this.page - 1) * this.take
  }
}
