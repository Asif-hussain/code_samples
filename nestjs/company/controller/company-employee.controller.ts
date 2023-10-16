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
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCompanyEmployeeRequestDto } from '../dto/create-company-employee-request.dto';
import { CompanyEmployeeDto } from '../dto/company-employee.dto';
import { TagListingRequestDto } from '../../tags/dto/tag-listing-request.dto';
import { PageResponseDto } from '../../shared/dto/page-response.dto';
import { CompanyEmployeeService } from '../service/company-employee.service';
import { CompanyTeamDto } from '../dto/company-team.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('company/team/employees')
@SkipThrottle()
@UseInterceptors(TransactionInterceptor)
@ApiTags('WEB - Company Employee Management')
@Roles(Role.super_admin, Role.global_admin, Role.admin, Role.customer)
export class CompanyEmployeeController {
  constructor (private readonly companyEmployeeService: CompanyEmployeeService) {
  }

  /**
   * @param req
   * @param request
   * @param file
   * @returns CompanyEmployeeDto
   */
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create (
      @Request() req,
      @Body() request: CreateCompanyEmployeeRequestDto,
      @UploadedFile() file
  ): Promise<CompanyEmployeeDto> {
    return this.companyEmployeeService.createEmployeeMember(
      request,
      file
    )
  }

  /**
   * @param id
   * @param req
   * @param request
   * @param file
   * @returns CompanyEmployeeDto
   */
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a employee member that exists in the database',
    type: Number
  })
  update (
      @Param('id') id,
      @Request() req,
      @Body() request: CreateCompanyEmployeeRequestDto,
      @UploadedFile() file
  ): Promise<CompanyEmployeeDto> {
    return this.companyEmployeeService.updateEmployeeMember(
      id,
      request,
      file
    )
  }

  /**
   * @param id
   * @returns CompanyEmployeeDto
   */
  @Get('/:id')
  @ApiOkResponse({ type: CompanyEmployeeDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a employee member that exists in the database',
    type: Number
  })
  get (@Param('id') id): Promise<CompanyEmployeeDto> {
    return this.companyEmployeeService.getOne(id)
  }

  /**
   * @param id
   * @returns CompanyEmployeeDto
   */
  @Delete('/:id')
  @ApiOkResponse({ type: CompanyTeamDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a team member that exists in the database',
    type: Number
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  delete (@Param('id') id): Promise<void> {
    return this.companyEmployeeService.deleteMember(id)
  }

  /**
   * @param request
   * @returns CompanyEmployeeDto
   */
  @Post('/all')
  @ApiOkResponse({ type: [CompanyEmployeeDto] })
  getAll (@Body() request: TagListingRequestDto): Promise<PageResponseDto> {
    return this.companyEmployeeService.getAll(request)
  }
}
