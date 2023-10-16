import { Controller, Get, Param, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransactionInterceptor } from '../../shared/interceptor/transaction.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RateDto } from '../dto/rate.dto';
import { PlanService } from '../service/plan.service';
import { UserPlanDto } from '../dto/user.plan.dto';
import { PlanDto } from '../dto/plan.dto';

@Controller('plan')
@SkipThrottle()
@ApiBearerAuth()
@UseInterceptors(TransactionInterceptor)
@ApiTags('CMS - Plans Management')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanController {
  constructor (private readonly planService: PlanService) {
  }

  @Get('/user/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  @ApiOkResponse({ type: RateDto })
  async getUserRate (@Request() req, @Param('id') id): Promise<UserPlanDto | void> {
    return this.planService.getOne(id)
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a plan that exists in the database',
    type: Number
  })
  @ApiOkResponse({ type: PlanDto })
  async getRate (@Request() req, @Param('id') id): Promise<PlanDto | void> {
    return this.planService.getOnePlan(id)
  }
}
