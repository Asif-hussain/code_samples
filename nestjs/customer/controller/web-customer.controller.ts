import {
  Body,
  Controller, Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../shared/decorator/roles.decorator';
import { Role } from '../../shared/enum/role';
import { UserDto } from '../../users/dto/user.dto';
import { UsersService } from '../../users/service/users.service';
import { CreateUpdateUserPreferenceRequest } from '../../users/dto/create-update-user-preference-request';
import { UserPreferenceDto } from '../../users/dto/user.preference.dto';
import { TransactionInterceptor } from '../../shared/interceptor/transaction.interceptor';
import { SearchUserRequestDto } from '../../users/dto/search-user-request.dto';
import { PageResponseDto } from '../../shared/dto/page-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionParam } from '../../shared/decorator/transaction-param.decorator';
import { Transaction } from 'sequelize';
import { UpdateUserPasswordRequestDto } from '../../users/dto/update-user-password.request.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { UpdateCustomerRequestDto } from '../../users/dto/update-customer-request.dto';
import { CustomerService } from '../service/customer.service';

@Controller('customers')
@SkipThrottle()
@ApiBearerAuth()
@ApiTags('WEB - Customers Management')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransactionInterceptor)
@Roles(Role.customer, Role.super_admin, Role.admin, Role.global_admin)
export class WebCustomerController {
  constructor (private readonly usersService: UsersService, private readonly customerService: CustomerService) {}

  /**
   * the following method is used to add or update user preference
   * @param id
   * @param request
   * @returns UserDto
   */
  @Post('/:id/preference')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  addOrUpdateUserPreference (
    @Param('id') id,
    @Body() request: CreateUpdateUserPreferenceRequest
  ): Promise<UserPreferenceDto> {
    return this.usersService.addUpdateUserPreference(id, request)
  }

  /**
   * the following method is used to get customer listing
   * @param searchRequest
   * @returns UserDto
   */
  @Post('/all')
  @ApiOkResponse({ type: [UserDto] })
  findAll (@Body() searchRequest: SearchUserRequestDto): Promise<PageResponseDto> {
    searchRequest.role = Role.customer
    return this.usersService.findAll(searchRequest)
  }

  /**
   * the following method is used to get update user details
   * @param id
   * @param updateUserDto
   * @param file
   * @param transaction
   * @returns UserDto
   */
  @Put('/:id')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  update (
      @Param('id') id,
      @Body() updateUserDto: UpdateCustomerRequestDto,
      @UploadedFile() file,
      @TransactionParam() transaction: Transaction
  ): Promise<UserDto> {
    return this.usersService.updateCustomer(
      id,
      updateUserDto,
      file,
      transaction
    )
  }

  @Patch('/:id/update-password')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  updatePassword (
      @Param('id') id,
      @Body() request: UpdateUserPasswordRequestDto
  ): Promise<void> {
    return this.usersService.updatePassword(id, request)
  }

  @Patch('/regenerate-api-key')
  @ApiOkResponse({ type: UserDto })
  regenerateApiKey (
      @Param('id') id, @Request() req
  ): Promise<UserDto> {
    return this.usersService.regenerateApiKey(req.user)
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * calculates current storage of all users
   */
  @Post('/calculate-storage')
  calculateStorage () {
    return this.customerService.calculateStorage()
  }

  /**
   * @param id
   * @constructor
   */
  @Get('/:id/get-storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  GetStorage (
      @Param('id') id
  ): Promise<{ storageAllocated: any; storageUsed: any }> {
    return this.usersService.getUserStorage(id)
  }
}
