import {
  IsOptional,
  IsBoolean,
  IsString
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PageRequestDto } from '../../shared/dto/page-request.dto'

export class BlogListingRequestDto extends PageRequestDto {
    @ApiProperty()
    @IsOptional()
  readonly search?: string

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    readonly active?: boolean

  @ApiProperty()
    @IsString()
    @IsOptional()
    readonly status?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
  readonly author?: string

  @ApiProperty()
    @IsOptional()
    readonly tags?: []

  @ApiProperty()
    @IsString()
    @IsOptional()
  readonly fromDate?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
  readonly toDate?: string
}
