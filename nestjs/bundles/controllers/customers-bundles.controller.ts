import {
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiParam } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { TransactionInterceptor } from '../../shared/interceptor/transaction.interceptor'
import { BundlesResponseDto } from '../dto/bundles.response.dto'
import { CustomersBundlesService } from '../services/customers-bundles.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { UserBundleResponseDto } from '../../bundles/dto/user-bundle.response.dto'
import { CurrentBundleResponseDto } from '../dto/current-bundle.response.dto'
import { UpdateBundleResponseDto } from '../dto/update-bundle.response.dto'

@Controller('customers/bundles')
@SkipThrottle()
@ApiBearerAuth()
@ApiTags('Users - Bundles Management')
@UseInterceptors(TransactionInterceptor)
export class CustomersBundlesController {
  constructor (private customersBundlesService: CustomersBundlesService) {}

  /**
   * This GET api will return the sytem created bundles
   * @returns {BundlesResponseDto[]}
   */
  @Get('system')
  @ApiOkResponse()
  async getSystemBundles (): Promise<BundlesResponseDto[]> {
    return this.customersBundlesService.getDefaultBundles()
  }

  /**
   * This GET api will return the current user bundle with the system default bundles
   * @param {any} req
   * @returns {CurrentBundleResponseDto}
   */
  @Get('current-plan')
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSystemBundlesAndUserPlan (
    @Req() req: any
  ): Promise<CurrentBundleResponseDto> {
    return this.customersBundlesService.getSystemBundlesAndUserPlan(req.user.id)
  }

  /**
   * This GET api is to get the bundle by user id
   * @param {number} userId
   * @returns {CustomerBundleResponse}
   */
  @Get('user/:userId')
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBundleByUserId (
    @Param('userId') userId: number
  ): Promise<UserBundleResponseDto> {
    return this.customersBundlesService.getBundleByUserId(userId)
  }

  /**
   * This PATCH api is to change a user bundle
   * @param {number} bundleId
   * @param {any} req
   */
  @Put('change-plan/charge-bundle/:bundleId')
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async changeUserBundle (
    @Param('bundleId') bundleId: number,
    @Req() req: any
  ): Promise<UpdateBundleResponseDto> {
    return await this.customersBundlesService.chargeBundleToUserWalletCheck(req.user.id, bundleId)
  }

  /**
   *  This method is used to verify the bundle check limits
   * @param id
   * @returns void
   */

  @Get('verify-bundle-limits/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number
  })
  async verifyBundleLimits (
    @Param('id') id
  ): Promise<boolean> {
    return this.customersBundlesService.verifyBundleLimits(id)
  }
}
