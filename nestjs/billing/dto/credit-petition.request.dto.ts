import { ApiProperty } from '@nestjs/swagger'
import { IsDefined } from 'class-validator'
import { AmountTypeEnum } from './enum/amountTypeEnum'

export class CreditPetitionRequestDto {
  @ApiProperty()
  @IsDefined()
  readonly amountType: AmountTypeEnum

  @ApiProperty()
  @IsDefined()
  readonly amount: number

  @ApiProperty()
  @IsDefined()
  readonly credit: number
}
