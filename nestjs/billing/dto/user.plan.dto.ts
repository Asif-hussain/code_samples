import { BaseDto } from '../../shared/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserPlan } from '../model/user.plan';

export class UserPlanDto extends BaseDto {
    @ApiProperty()
      id: string

    @ApiProperty()
      privateProjectRemaining: number

    @ApiProperty()
      trainingRemaining: number

    @ApiProperty()
      inferencesRemaining: number

    constructor (userPlan: UserPlan) {
      super()

      this.id = userPlan.id
      this.privateProjectRemaining = userPlan.privateProjectRemaining
      this.trainingRemaining = userPlan.trainingRemaining
      this.inferencesRemaining = userPlan.inferencesRemaining
    }
}
