import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { Roles } from '../../shared/decorator/roles.decorator'
import { PageResponseDto } from '../../shared/dto/page-response.dto'
import { Role } from '../../shared/enum/role'
import { TransactionInterceptor } from '../../shared/interceptor/transaction.interceptor'
import { BundlesListingRequestDto } from '../dto/bundles-listing-request.dto'
import { BundlesResponseDto } from '../dto/bundles.response.dto'
import { BundlesService } from '../services/bundles.service'
import { CreateBundleRequestDto } from '../dto/create-bundles-request.dto'
import { UpdateBundleRequestDto } from '../dto/update-bundles-request.dto'
import { UpdateSystemBundlesDto } from '../dto/update-system-bundles.dto'
import { ChargeBundleRequestDto } from '../dto/charge-bundle-request.dto'
import { UserAuthTokenService } from '../../users/service/user-auth-token.service'

@Controller('admin/bundles')
@SkipThrottle()
@ApiBearerAuth()
@ApiTags('CMS - Bundles Management')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransactionInterceptor)
@Roles(Role.super_admin, Role.global_admin, Role.admin)
export class BundlesController {
  constructor (
    private bundlesService: BundlesService,
    private userAuthTokenService: UserAuthTokenService
  ) {}

  /**
   * This POST api takes a search request body and returns a listing page response for all bundles
   * @param {BundlesListingRequestDto} searchRequest
   * @returns {PageResponseDto}
   */
  @Post('/all')
  @ApiOkResponse({ type: PageResponseDto })
  @HttpCode(200)
  async getAllBundles (
    @Body() searchRequest: BundlesListingRequestDto
  ): Promise<PageResponseDto> {
    return this.bundlesService.getAllBundles(searchRequest)
  }

  /**
   * This GET api is used to return the default bundles in the DB
   * @returns {BundlesResponseDto[]}
   */
  @Get('/system')
  @ApiOkResponse({ type: [BundlesResponseDto] })
  async getDefaultBundles (): Promise<BundlesResponseDto[]> {
    return this.bundlesService.getDefaultBundles()
  }

  /**
   * This GET api is used to fetch 1 Bundles record from the DB with a valid ID
   * @param {number} id
   * @returns {BundlesResponseDto}
   */
  @Get('/:id')
  @ApiOkResponse({ type: BundlesResponseDto })
  async getBundle (@Param('id') id: number): Promise<BundlesResponseDto> {
    return this.bundlesService.getBundle(id)
  }

  /**
   * This POST api is to create a new bundle
   * @param {CreateBundleRequestDto} createBundleRequestDto
   * @returns {BundlesResponseDto}
   */
  @Post()
  @ApiOkResponse({ type: BundlesResponseDto })
  async createBundle (
    @Body() createBundleRequestDto: CreateBundleRequestDto
  ): Promise<BundlesResponseDto> {
    return this.bundlesService.createBundle(createBundleRequestDto)
  }

  /**
   * This PUT api is to update a bundle record in the DB
   * @param {number} id
   * @param {UpdateBundleRequestDto} updateBundleRequestDto
   * @returns {BundlesResponseDto}
   */
  @Put('/:id')
  @ApiOkResponse({ type: BundlesResponseDto })
  async updateBundle (
    @Param('id') id: number,
    @Body() updateBundleRequestDto: UpdateBundleRequestDto
  ): Promise<BundlesResponseDto> {
    return this.bundlesService.updateBundle(id, updateBundleRequestDto)
  }

  /**
   * This DELETE api is to remove a bundle record from the DB
   * @param {number} id
   */
  @Delete('/:id')
  @ApiOkResponse()
  async deleteBundle (@Param('id') id: number): Promise<void> {
    await this.bundlesService.deleteBundle(id)
  }

  /**
   * This PATCH api is used to update the system created bundles
   * @param {UpdateSystemBundlesDto} updateSystemBundlesDto
   * @returns {BundlesResponseDto[]}
   */
  @Patch('/system/update')
  @ApiOkResponse({ type: [BundlesResponseDto] })
  async updateSystemBundles (
    @Body() updateSystemBundlesDto: UpdateSystemBundlesDto
  ): Promise<BundlesResponseDto[]> {
    return this.bundlesService.updateSystemBundles(updateSystemBundlesDto)
  }

  /**
   * This PATCH api is used to update the system created bundles
   * @param {ChargeBundleRequestDto} request
   * @param req
   */
  @Patch('/change-plan/charge-bundle')
  @ApiOkResponse()
  async chargeBundleToUserWallet (
    @Body() request: ChargeBundleRequestDto
  ): Promise<void> {
    await this.bundlesService.chargeBundleToUserWallet(
      request.userId,
      request.bundleId
    )

    await this.userAuthTokenService.deleteAllUserAuthTokens(request.userId)
  }
}
