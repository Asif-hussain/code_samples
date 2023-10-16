import { BaseDto } from '../../shared/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AmountTypeEnum } from './enum/amountTypeEnum';

export class CreditDto extends BaseDto {
    @ApiProperty()
      id: string

    @ApiProperty()
    readonly amountType: AmountTypeEnum

    @ApiProperty()
      amount: number

    @ApiProperty()
      credit: number
}
