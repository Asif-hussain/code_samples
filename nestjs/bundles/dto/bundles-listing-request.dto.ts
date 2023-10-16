import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { PageRequestDto } from '../../shared/dto/page-request.dto'

export class BundlesListingRequestDto extends PageRequestDto {
  @ApiProperty()
  @IsOptional()
  readonly search?: string

  @ApiProperty()
  @IsOptional()
  readonly userBundleId?: number
}
