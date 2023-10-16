import { Controller, Get, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreditService } from '../service/credit.service';
import { CreditDto } from '../dto/credit.dto';

@Controller('credit-details')
@SkipThrottle()
@ApiBearerAuth()
@ApiTags('Customer - Online Payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreditController {
  constructor (private readonly creditService: CreditService) {
  }

  @Get('/all')
  @ApiOkResponse({ type: CreditDto })
  async getAllCreditDetails () {
    return this.creditService.getAllCreditDetails()
  }
}
