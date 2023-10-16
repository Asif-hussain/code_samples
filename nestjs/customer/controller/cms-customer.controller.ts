import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { Roles } from '../../shared/decorator/roles.decorator'
import { Role } from '../../shared/enum/role'
import { UserDto } from '../../users/dto/user.dto'
import { UsersService } from '../../users/service/users.service'
import { CreateUpdateUserPreferenceRequest } from '../../users/dto/create-update-user-preference-request'
import { UserStatusUpdateRequestDto } from '../../users/dto/user-status-update-request.dto'
import { UserPreferenceDto } from '../../users/dto/user.preference.dto'
import { TransactionInterceptor } from '../../shared/interceptor/transaction.interceptor'
import { FileInterceptor } from '@nestjs/platform-express'
import { TransactionParam } from '../../shared/decorator/transaction-param.decorator'
import { Transaction } from 'sequelize'
import { UpdateUserPasswordRequestDto } from '../../users/dto/update-user-password.request.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { UpdateCustomerRequestDto } from '../../users/dto/update-customer-request.dto';

@Controller('admin/customers')
@SkipThrottle()
@ApiBearerAuth()
@ApiTags('CMS - Customers Management')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransactionInterceptor)
@Roles(Role.super_admin, Role.global_admin, Role.admin)
export class CmsCustomerController {
  constructor (private readonly usersService: UsersService) {}

  /**
   * the following method is used to delete
   * @param id
   * @returns UserDto
   */
  @Delete('/:id')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  delete (@Param('id') id): Promise<boolean> {
    return this.usersService.delete(id)
  }

  /**
   * to get the user details with the respective id
   * @param req
   * @param id
   */
  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  @ApiOkResponse({ type: UserDto })
  async getUser (@Request() req, @Param('id') id): Promise<UserDto> {
    return this.usersService.getUser(id)
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
   * the following method is used to get update user status
   * @param id
   * @param request
   * @returns UserDto
   */
  @Patch('/:id/update-status')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  updateStatus (
    @Param('id') id,
    @Body() request: UserStatusUpdateRequestDto
  ): Promise<void> {
    return this.usersService.updateStatus(id, request)
  }/**
   * the following method is used to get update user password
   * @param id
   * @param request
   */

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
}
