import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator';
import { PageRequestDto } from '../../shared/dto/page-request.dto'

export class BlogAuthorListingRequestDto extends PageRequestDto {
  @ApiProperty()
  @IsOptional()
  readonly search?: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly active?: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly isProject?: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly hasResources?: boolean
}
