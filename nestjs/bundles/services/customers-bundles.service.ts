import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { User } from '../../users/model/user.model'
import { UserBundleResponseDto } from '../dto/user-bundle.response.dto'
import { Bundles } from '../model/bundles.model'
import { UserBundle } from '../model/user-bundle.model'
import { BundlesService } from './bundles.service'
import { UserBundleService } from './user-bundle.service'
import { isBundleLimitExceeded } from '../utils/bundle-limit-exceeded.util'
import { CurrentBundleResponseDto } from '../dto/current-bundle.response.dto'
import { MailService } from '../../shared/service/mail.service'
import { config } from '../../../config'
import { UserWalletService } from '../../users/service/user.wallet.service'
import { UserStats } from '../../users/model/user-stats.model'
import { UserAuthTokenService } from '../../users/service/user-auth-token.service'
import { UpdateBundleResponseDto } from '../dto/update-bundle.response.dto'

@Injectable()
export class CustomersBundlesService extends BundlesService {
  constructor (
    bundlesRepository: typeof Bundles,
    userRepository: typeof User,
    userBundleService: UserBundleService,
    userAuthTokenService: UserAuthTokenService,
    private mailService: MailService,
    private userWalletService: UserWalletService
  ) {
    super(bundlesRepository, userRepository, userBundleService, userAuthTokenService)
  }

  private readonly logger = new Logger(CustomersBundlesService.name)

  /**
   * This method is used to find a Bundle by User id
   * @param userId
   * @returns {CustomerBundleResponse}
   */
  async getBundleByUserId (userId: number): Promise<UserBundleResponseDto> {
    const foundUser = await this.userRepository.findByPk(userId, {
      include: [
        { model: UserBundle, include: [Bundles] },
        { model: UserStats }
      ]
    })
    if (!foundUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND)
    }
    return new UserBundleResponseDto(foundUser.userBundle, foundUser.userStats)
  }

  /**
   * This method will do a check that the user is requesting a default bundle before the charge
   * @param userId
   * @param bundleId
   */
  async chargeBundleToUserWalletCheck (
    userId: number,
    bundleId: number
  ): Promise<UpdateBundleResponseDto> {
    const foundBundle = await this.bundlesRepository.findOne({
      where: {
        id: bundleId,
        isSystemCreated: true
      }
    });

    const foundUser = await this.userRepository.findByPk(userId, {
      include: [
        {
          model: UserBundle,
          include: [
            {
              model: Bundles
            }
          ]
        },
        {
          model: UserStats
        }
      ]
    });

    if (!foundBundle) {
      throw new HttpException(
        'System created Bundle cannot be assigned!',
        HttpStatus.METHOD_NOT_ALLOWED
      );
    }

    await this.chargeBundleToUserWallet(userId, foundBundle.id);

    const updatedUserBundle = await UserBundle.findOne({
      where: {
        userId
      },
      include: Bundles
    });

    const updatedUserStats = await UserStats.findOne({
      where: {
        userId
      }
    });

    if (foundUser.userBundle.bundleId !== bundleId) {
      await this.mailService.sendEmail(
        './src/bundles/template/mail/notify-admin-changed-bundle',
        config.kasutAdminEmail,
        'Thya Technology - User Bundle Changed',
        {
          username: `${foundUser.firstName} ${foundUser.lastName}`,
          bundleName: foundBundle.name,
          email: config.kasutAdminEmail,
          bundleCost: updatedUserBundle.bundle.cost.toFixed(2),
          cdnLink: config.cdnUrl,
          url: `${config.cmsPortalUrl}/crm/${foundUser.id}`
        }
      );
    }

    return new UpdateBundleResponseDto(updatedUserBundle, updatedUserStats);
  }

  /**
   * This method will get the default bundles and the user current bundle info
   * @param userId
   * @returns {CurrentBundleResponseDto}
   */
  async getSystemBundlesAndUserPlan (
    userId: number
  ): Promise<CurrentBundleResponseDto> {
    const currentUserBundle = await this.userBundleService.getCurrentUserBundle(
      userId
    )

    const defaultBundles = await this.getDefaultBundles()
    return new CurrentBundleResponseDto(currentUserBundle, defaultBundles)
  }

  /**
   * This method is used to verify the bundle check limits
   * @param id
   * @returns boolean
   */
  async verifyBundleLimits (id: number) : Promise<boolean> {
    try {
      const user = await this.userRepository.findOne<User>({
        where: { id },
        include: [{ model: UserBundle }]
      })
      if (!user) {
        throw new HttpException(
          'User not found, Please prove valid user id',
          HttpStatus.NOT_FOUND
        )
      }
      return await isBundleLimitExceeded(user.id, user.userBundle.bundleId)
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
