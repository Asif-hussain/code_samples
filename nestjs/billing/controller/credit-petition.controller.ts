import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreditPetitionRequestDto } from '../dto/credit-petition.request.dto';
import { CreditPetitionService } from '../service/credit-petition.service';

@Controller('customer/credit-petition')
@SkipThrottle()
@ApiBearerAuth()
@ApiTags('Customer - Credit Petition')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreditPetitionController {
  constructor (private readonly creditPetitionService: CreditPetitionService) {
  }

  /**
   * This POST api is used to call the method used to send an email to the Thya Tech team for credit petition
   * @param {CreditPetitionRequestDto} request
   * @param {any} req
   */
  @Post()
  @ApiBody({ type: CreditPetitionRequestDto })
  @ApiOkResponse()
  async customerCreditRequest (@Body() request: CreditPetitionRequestDto, @Request() req) {
    return this.creditPetitionService.sendCreditPetitionEmail(request, req.user)
  }
}
