import { ApiProperty } from '@nestjs/swagger'

export class UpdateRateRequest {
    @ApiProperty()
  readonly inferenceRate: number | string

    @ApiProperty()
    readonly trainingRate: number | string

    @ApiProperty()
    readonly freeCredits: number | string

  @ApiProperty()
    readonly datasetDefaultFee: number | string

  @ApiProperty()
  readonly projectDefaultFee: number | string
}
