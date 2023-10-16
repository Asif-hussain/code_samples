import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { BaseService } from '../../shared/service/base.service'
import { UserBundle } from '../model/user-bundle.model'
import { UserBundleRequest } from '../dto/user-bundle-request.dto'
import { Bundles } from '../model/bundles.model'
import { CurrentUserBundleResponseDto } from '../dto/current-user-bundle.response.dto'
import { isBundleLimitExceeded, updateBundleLimits } from '../utils/bundle-limit-exceeded.util'
import { UserStats } from '../../users/model/user-stats.model'

@Injectable()
export class UserBundleService extends BaseService {
  constructor (
    @Inject('USER_BUNDLE_REPOSITORY')
    private userBundleRepository: typeof UserBundle
  ) {
    super()
  }

  /**
   * This method wil create or update an existing user bundle and flag its user for limit exceeded
   * @param userBundleRequest
   * @param isLimitExceeded
   */
  async createOrUpdateUserBundle (
    userBundleRequest: UserBundleRequest,
    isLimitExceeded: boolean
  ): Promise<void> {
    const userBundle = await this.userBundleRepository.findOne({
      where: {
        userId: userBundleRequest.userId
      }
    })

    const foundBundle = await Bundles.findByPk(userBundleRequest.bundleId, {
      attributes: ['cost']
    })

    const today = new Date()
    const nextBillingDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    if (!userBundle) {
      const newUserBundle = new UserBundle()

      newUserBundle.userId = userBundleRequest.userId
      newUserBundle.bundleId = userBundleRequest.bundleId
      newUserBundle.bundlePurchaseCost = foundBundle.cost
      newUserBundle.bundlePurchaseDate = today
      newUserBundle.nextBillingDate = nextBillingDate
      newUserBundle.isLimitExceeded = isLimitExceeded
      newUserBundle.active = true

      await newUserBundle.save()
    } else {
      userBundle.bundleId = userBundleRequest.bundleId
      userBundle.isLimitExceeded = isLimitExceeded
      userBundle.bundlePurchaseCost = foundBundle.cost
      userBundle.bundlePurchaseDate = today
      userBundle.nextBillingDate = nextBillingDate

      await userBundle.save()
    }
  }

  async getCurrentUserBundle (userId: number): Promise<CurrentUserBundleResponseDto> {
    const userBundle = await this.userBundleRepository.findOne({
      where: { userId },
      include: { model: Bundles }
    })

    if (!userBundle) {
      throw new HttpException('User bundle not found!', HttpStatus.NOT_FOUND)
    }

    const userStats = await UserStats.findOne({
      where: { userId }
    })

    if (!userStats) {
      throw new HttpException('User stats not found!', HttpStatus.NOT_FOUND)
    }

    return new CurrentUserBundleResponseDto(userBundle, userStats)
  }

  async updateIsLimitExceeded (userId: number): Promise<void> {
    const foundUserBundle = await this.userBundleRepository.findOne<UserBundle>({
      where: {
        userId
      }
    })
    const checkBundleLimits = await isBundleLimitExceeded(foundUserBundle.userId, foundUserBundle.bundleId)
    await updateBundleLimits(foundUserBundle.userId, foundUserBundle.bundleId, checkBundleLimits)
  }
}
