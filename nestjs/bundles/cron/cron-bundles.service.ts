import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Bundles } from '../model/bundles.model'
import { User } from '../../users/model/user.model'
import { Op, QueryTypes } from 'sequelize'
import { UserWalletHistory } from '../../users/model/user.wallet.history.model'
import { WalletUsageType } from '../../shared/enum/wallet-usage-type'
import { UserWallet } from '../../users/model/user.wallet.model'
import { UserBundle } from '../model/user-bundle.model'
import { UserBundleService } from '../services/user-bundle.service'
import { isBundleLimitExceeded } from '../utils/bundle-limit-exceeded.util'
import { BundlesNameEnum } from '../types/bundles-name.enum'
import { UserAuthTokenService } from '../../users/service/user-auth-token.service'

export class CronBundlesService {
  constructor (
    @Inject('USER_BUNDLE_REPOSITORY')
    private userBundleRepository: typeof UserBundle,
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private userBundleService: UserBundleService,
    private userAuthTokenService: UserAuthTokenService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_30_MINUTES)
  async dailyJobs () {
    await this.findUsersWithExpiredBundles()
  }

  /**
   * This method will fetch all the user bundles and with a next billing date matching the current date
   */
  async findUsersWithExpiredBundles (): Promise<void> {
    const currentDate = new Date() // Current date
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    )

    startDate.setHours(0, 0, 0, 0); // Set time to midnight
    endDate.setHours(0, 0, 0, 0); // Set time to midnight of the next day

    const findUserBundles = await this.userBundleRepository.findAll({
      include: {
        model: Bundles
      },
      where: { nextBillingDate: { [Op.gte]: startDate, [Op.lt]: endDate } }
      // This where should be removed after testing
      // where: { userId: { [Op.in]: [293, 265, 60, 346, 230] } }
    })

    this.renewBundleForUserScheduleJob(findUserBundles)
  }

  /**
   * This method will take a user bundles array and run checks
   * @param foundUserBundles
   */
  renewBundleForUserScheduleJob (foundUserBundles: UserBundle[]): void {
    if (foundUserBundles.length > 0) {
      foundUserBundles.forEach(async (userBundle) => {
        const hasCredits = await this.validateCredit(userBundle.userId, userBundle.bundle.cost)
        if (hasCredits) {
          await this.userBundleService.createOrUpdateUserBundle({ userId: userBundle.userId, bundleId: userBundle.bundleId }, await isBundleLimitExceeded(userBundle.userId, userBundle.bundleId))
        } else {
          const isLimitExceeded = await isBundleLimitExceeded(userBundle.userId, 1)
          await this.userBundleService.createOrUpdateUserBundle({ userId: userBundle.userId, bundleId: 1 }, isLimitExceeded)
          await this.userAuthTokenService.deleteAllUserAuthTokens(userBundle.userId)
        }

        const user = await this.userRepository.findByPk(userBundle.userId, {
          include: {
            model: UserBundle,
            include: [{
              model: Bundles
            }]
          }
        })
        await this.deductCredit(user.id, user.userBundle.bundle)
      })
    }
  }

  /**
   * This method will validate if a user has credit for the bundle cost
   * @param userId
   * @param cost
   * @returns {boolean}
   */
  private async validateCredit (userId: number, cost: number): Promise<boolean> {
    let hasCredits = false
    const userWallet = await UserWallet.findOne({ where: { userId } })
    if (userWallet.value >= cost) {
      hasCredits = true
    }
    return hasCredits
  }

  /**
   * The following method will deduct the credit from a user for a bundle cost
   * @param userId
   * @param bundle
   */
  private async deductCredit (userId: number, bundle: Bundles): Promise<void> {
    const userWallet = await UserWallet.findOne<UserWallet>({
      where: { userId }
    })
    const value = Number(userWallet.value) - Number(bundle.cost)
    // checking if wallet is becoming negative
    if (value < 0) {
      throw new HttpException('Wallet cannot be negative', HttpStatus.CONFLICT)
    }
    userWallet.value = value

    await userWallet.save()

    const walletHistory = new UserWalletHistory()
    walletHistory.userId = userWallet.userId
    walletHistory.walletId = Number(userWallet.id)
    walletHistory.value = Number(bundle.cost)
    walletHistory.walletAmount = Number(userWallet.value)
    // TODO: If admin is going to purchase a user bundle then who's id will be the action by
    // SUGGESTION: We can remove CONSTRAINT KEYS on the action_by_id column
    walletHistory.actionById = userId
    walletHistory.isAdd = false
    if (bundle.name.toLowerCase() === BundlesNameEnum.free) {
      walletHistory.walletUsageType = WalletUsageType.free_bundle
    } else if (bundle.name.toLowerCase() === BundlesNameEnum.pro) {
      walletHistory.walletUsageType = WalletUsageType.pro_bundle
    } else {
      walletHistory.walletUsageType = WalletUsageType.custom_bundle
    }
    await walletHistory.save()

    await UserWalletHistory.sequelize.query('INSERT INTO user_wallet_history_details (user_wallet_history_id, wallet_id, created_at, updated_at, bundle_id) VALUES (:historyId, :walletId, now(), now(), :bundleId)', {
      replacements: { historyId: walletHistory.id, walletId: userWallet.id, bundleId: bundle.id }, type: QueryTypes.INSERT
    })
  }
}
