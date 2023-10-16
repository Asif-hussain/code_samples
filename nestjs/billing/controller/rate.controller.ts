import { Body, Controller, Get, Param, Patch, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransactionInterceptor } from '../../shared/interceptor/transaction.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RateService } from '../service/rate.service';
import { RateDto } from '../dto/rate.dto';
import { UpdateRateRequest } from '../dto/update.rate.request';

@Controller('admin/rates')
@SkipThrottle()
@ApiBearerAuth()
@UseInterceptors(TransactionInterceptor)
@ApiTags('CMS - Rate Management')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RateController {
  constructor (private readonly rateService: RateService) {
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a rate that exists in the database',
    type: Number
  })
  @ApiOkResponse({ type: RateDto })
  async getRate (@Request() req, @Param('id') id): Promise<RateDto | void> {
    return this.rateService.getOne(id)
  }

  @Patch('/:id/update')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a rate that exists in the database',
    type: Number
  })
  @ApiOkResponse({ type: RateDto })
  async updateRate (@Request() req, @Body() request: UpdateRateRequest, @Param('id') id): Promise<RateDto | void> {
    return this.rateService.updateRate(id, request)
  }
}
