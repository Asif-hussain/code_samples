import { BaseDto } from '../../shared/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Rate } from '../model/rate';

export class RateDto extends BaseDto {
    @ApiProperty()
      id: string

    @ApiProperty()
      trainingRate: number

    @ApiProperty()
      inferenceRate: number

    @ApiProperty()
      freeCredits: number

    @ApiProperty()
      datasetDefaultFee: number

    @ApiProperty()
      projectDefaultFee: number

    @ApiProperty()
      active: boolean

    constructor (rate: Rate) {
      super()

      this.id = rate.id
      this.trainingRate = rate.trainingRate
      this.inferenceRate = rate.inferenceRate
      this.freeCredits = rate.freeCredits
      this.datasetDefaultFee = rate.datasetDefaultFee
      this.projectDefaultFee = rate.projectDefaultFee
      this.active = rate.active
    }
}
