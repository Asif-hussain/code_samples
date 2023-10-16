import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined } from 'class-validator';

export class UpdateStatusRequest {
    @ApiProperty()
    @IsDefined()
    @IsBoolean()
      status: boolean
}
