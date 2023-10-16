import {
  Body,
  Controller, Delete, Get, Param, Post, Put, Request, UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { TransactionInterceptor } from '../../shared/interceptor/transaction.interceptor'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { Roles } from '../../shared/decorator/roles.decorator'
import { Role } from '../../shared/enum/role'
import { CompanyTeamService } from '../service/company-team.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCompanyTeamRequestDto } from '../dto/create-company-team-request.dto';
import { CompanyTeamDto } from '../dto/company-team.dto';
import { TagListingRequestDto } from '../../tags/dto/tag-listing-request.dto';
import { PageResponseDto } from '../../shared/dto/page-response.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('company/team/founders')
@SkipThrottle()
@UseInterceptors(TransactionInterceptor)
@ApiTags('WEB - Company Team Management')
@Roles(Role.super_admin, Role.global_admin, Role.admin, Role.customer)
export class CompanyTeamController {
  constructor (private readonly companyTeamService: CompanyTeamService) {
  }

  /**
   * @param req
   * @param request
   * @param file
   * @returns CompanyTeamDto
   */
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create (
      @Request() req,
      @Body() request: CreateCompanyTeamRequestDto,
      @UploadedFile() file
  ): Promise<CompanyTeamDto> {
    return this.companyTeamService.createTeamMember(
      request,
      file
    )
  }

  /**
   * @param id
   * @param req
   * @param request
   * @param file
   * @returns CompanyTeamDto
   */
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a team member that exists in the database',
    type: Number
  })
  update (
      @Param('id') id,
      @Request() req,
      @Body() request: CreateCompanyTeamRequestDto,
      @UploadedFile() file
  ): Promise<CompanyTeamDto> {
    return this.companyTeamService.updateTeamMember(
      id,
      request,
      file
    )
  }

  /**
   * @param id
   * @returns CompanyTeamDto
   */
  @Get('/:id')
  @ApiOkResponse({ type: CompanyTeamDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a team member that exists in the database',
    type: Number
  })
  get (@Param('id') id): Promise<CompanyTeamDto> {
    return this.companyTeamService.getOne(id)
  }

  /**
   * @param id
   * @returns CompanyTeamDto
   */
  @Delete('/:id')
  @ApiOkResponse({ type: CompanyTeamDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a team member that exists in the database',
    type: Number
  })
  delete (@Param('id') id): Promise<void> {
    return this.companyTeamService.deleteMember(id)
  }

  /**
   * @param request
   * @returns PageResponseDto
   */
  @Post('/all')
  @ApiOkResponse({ type: [CompanyTeamDto] })
  getAll (@Body() request: TagListingRequestDto): Promise<PageResponseDto> {
    return this.companyTeamService.getAll(request)
  }
}
