import { ApiProperty } from '@nestjs/swagger'
import { Bundles } from '../model/bundles.model'
import { BaseDto } from '../../shared/dto/base.dto'

export class BundlesListingResponseDto extends BaseDto {
  @ApiProperty()
    id: number

  @ApiProperty()
    name: string

  @ApiProperty()
    isSystemCreated: boolean

  @ApiProperty()
    cost: number

  @ApiProperty()
    maxImages: number

  constructor (bundles: Bundles) {
    super()
    this.id = bundles.id
    this.name = bundles.name
    this.cost = bundles.cost
    this.maxImages = bundles.maxImages
    this.isSystemCreated = bundles.isSystemCreated
  }
}
