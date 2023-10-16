import { BaseDto } from '../../shared/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '../model/plan';

export class PlanDto extends BaseDto {
    @ApiProperty()
      id: string

    @ApiProperty()
      name: string

    @ApiProperty()
      privateProjects: number

    @ApiProperty()
      trainings: number

    @ApiProperty()
      inferences: number

    constructor (plan: Plan) {
      super()

      this.id = plan.id
      this.name = plan.name
      this.privateProjects = plan.privateProjects
      this.trainings = plan.trainings
      this.inferences = plan.inferences
    }
}
