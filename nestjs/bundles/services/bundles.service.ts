import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { WhereAttributeHash, Op, QueryTypes } from 'sequelize'
import { PageResponseDto } from '../../shared/dto/page-response.dto'
import { BaseService } from '../../shared/service/base.service'
import { BundlesListingRequestDto } from '../dto/bundles-listing-request.dto'
import { BundlesListingResponseDto } from '../dto/bundles-listing.response.dto'
import { BundlesResponseDto } from '../dto/bundles.response.dto'
import { Bundles } from '../model/bundles.model'
import { CreateBundleRequestDto } from '../dto/create-bundles-request.dto'
import { UpdateBundleRequestDto } from '../dto/update-bundles-request.dto'
import { User } from '../../users/model/user.model'
import { SortOrder } from '../../shared/enum/sortOrder'
import { UpdateSystemBundlesDto } from '../dto/update-system-bundles.dto'
import { UserWallet } from '../../users/model/user.wallet.model'
import { UserWalletHistory } from '../../users/model/user.wallet.history.model'
import { WalletUsageType } from '../../shared/enum/wallet-usage-type'
import { UserBundleService } from './user-bundle.service'
import { UserBundle } from '../model/user-bundle.model'
import { BundlesNameEnum } from '../types/bundles-name.enum'
import { isBundleLimitExceeded } from '../utils/bundle-limit-exceeded.util'
import { UserAuthTokenService } from '../../users/service/user-auth-token.service'

@Injectable()
export class BundlesService extends BaseService {
  constructor (
    @Inject('BUNDLES_REPOSITORY')
    protected bundlesRepository: typeof Bundles,
    @Inject('USER_REPOSITORY')
    protected userRepository: typeof User,
    protected userBundleService: UserBundleService,
    protected userAuthTokenService: UserAuthTokenService
  ) {
    super()
  }

  /**
   * This method will return the bundles that have the name FREE and PRO exclusively
   * @returns {BundlesResponseDto[]}
   */
  async getDefaultBundles (): Promise<BundlesResponseDto[]> {
    try {
      const foundBundles = await this.bundlesRepository.findAll({
        where: {
          isSystemCreated: true
        },
        order: [['id', SortOrder.asc]]
      })
      const bundlesResponseDto = foundBundles.map((bundle) => {
        return new BundlesResponseDto(bundle)
      })
      return bundlesResponseDto
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * This method will return all the bundles in the DB
   * @param {BundlesListingRequestDto} searchRequest
   * @returns {PageResponseDto}
   */
  async getAllBundles (
    searchRequest: BundlesListingRequestDto
  ): Promise<PageResponseDto> {
    try {
      const searchOrCondition: WhereAttributeHash = []
      const filterAndCondition = []

      if (searchRequest.search) {
        searchOrCondition.push({
          name: { [Op.iLike]: `%${searchRequest.search}%` }
        })
      }
      filterAndCondition.push({ isSystemCreated: false })
      let where: any = this.whereCondition
      // getting the updated where condition
      where = this.getWhereConditions(
        where,
        searchOrCondition,
        filterAndCondition
      )
      const allBundles: { rows: Bundles[]; count: number } =
        await this.bundlesRepository.findAndCountAll(
          this.getFindAllOptions(searchRequest, where, [], searchRequest.sortBy)
        )

      const foundBundles = allBundles.rows.map((bundle) => {
        return new BundlesListingResponseDto(bundle)
      })

      let data = await Promise.all(foundBundles)

      if (searchRequest.page === 1) {
        // If it's page 1, add the default system created bundles separately
        const systemCreatedBundles = await this.bundlesRepository.findAll({
          where: {
            isSystemCreated: true
          },
          order: [['id', SortOrder.asc]]
        })

        const defaultBundles = systemCreatedBundles.map(
          (bundle) => new BundlesListingResponseDto(bundle)
        )

        data = defaultBundles.concat(data)

        if (searchRequest.userBundleId) {
          data = data.filter((d) => d.id !== searchRequest.userBundleId)
        }
      }

      return new PageResponseDto(
        data,
        allBundles.count,
        searchRequest.page,
        searchRequest.size
      )
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * This method is for adding a new Bundles record to the DB
   * @param {CreateBundleRequestDto} createBundleRequestDto
   * @returns {BundlesResponseDto}
   */
  async createBundle (
    createBundleRequestDto: CreateBundleRequestDto
  ): Promise<BundlesResponseDto> {
    createBundleRequestDto.name = createBundleRequestDto.name.trim()
    const findBundleByName = await this.bundlesRepository.findOne({
      where: {
        name: { [Op.iLike]: createBundleRequestDto.name }
      }
    })
    // Extra check on bundle name if it is a match with an existing bundle name found in the DB
    const isMatchedName =
      createBundleRequestDto.name.toLowerCase() ===
      findBundleByName?.name.toLowerCase()

    if (findBundleByName && isMatchedName) {
      throw new HttpException('Name Already Exists', HttpStatus.CONFLICT)
    }

    createBundleRequestDto.isSystemCreated = false
    const newBundle = new Bundles({ ...createBundleRequestDto })

    await newBundle.save()

    return new BundlesResponseDto(newBundle)
  }

  /**
   * This method is to get 1 Bundles record from the DB with a valid ID
   * @param {number} id
   * @returns {BundlesResponseDto}
   */
  async getBundle (id: number): Promise<BundlesResponseDto> {
    const foundBundle = await this.bundlesRepository.findOne({
      where: {
        id
      }
    })

    if (!foundBundle) {
      throw new HttpException('Bundle not found', HttpStatus.NOT_FOUND)
    }

    return new BundlesResponseDto(foundBundle)
  }

  /**
   * This method will update a Bundle record in the DB that is with a valid ID and Unique Name
   * @param {number} id
   * @param {UpdateBundleRequestDto} updateBundlerequestDto
   * @returns {BundlesResponseDto}
   */
  async updateBundle (
    id: number,
    updateBundlerequestDto: UpdateBundleRequestDto
  ): Promise<BundlesResponseDto> {
    updateBundlerequestDto.name = updateBundlerequestDto.name.trim()
    const foundBundle = await this.bundlesRepository.findOne({
      where: {
        id
      }
    })

    if (!foundBundle) {
      throw new HttpException('Bundle not found', HttpStatus.NOT_FOUND)
    }

    const findBundleByName = await this.bundlesRepository.findOne({
      where: {
        name: { [Op.iLike]: updateBundlerequestDto.name }
      }
    })
    // Extra check on bundle name if it is a match with an existing bundle name found in the DB and check their IDs
    const isMatchedName =
      updateBundlerequestDto.name.toLowerCase() ===
        findBundleByName?.name.toLowerCase() &&
      foundBundle.id !== findBundleByName?.id

    if (findBundleByName && isMatchedName) {
      throw new HttpException('Name Already Exists', HttpStatus.CONFLICT)
    }

    foundBundle.name = updateBundlerequestDto.name
    foundBundle.cost = updateBundlerequestDto.cost
    foundBundle.trainingCost = updateBundlerequestDto.trainingCost
    foundBundle.inferenceCost = updateBundlerequestDto.inferenceCost
    foundBundle.privateDatasets = updateBundlerequestDto.privateDatasets
    foundBundle.privateProjects = updateBundlerequestDto.privateProjects
    foundBundle.maxImages = updateBundlerequestDto.maxImages
    foundBundle.allowsCollaborators = updateBundlerequestDto.allowsCollaborators
    foundBundle.activeLearningCost = updateBundlerequestDto.activeLearningCost
    foundBundle.deployments = updateBundlerequestDto.deployments
    foundBundle.modelDownloadCost = updateBundlerequestDto.modelDownloadCost
    foundBundle.canCloneDataset = updateBundlerequestDto.canCloneDataset
    foundBundle.canCloneProject = updateBundlerequestDto.canCloneProject
    foundBundle.canAccessApis = updateBundlerequestDto.canAccessApis
    foundBundle.cloningRoyalty = updateBundlerequestDto.cloningRoyalty
    foundBundle.smartAnnotationsCost =
      updateBundlerequestDto.smartAnnotationsCost
    foundBundle.allowsModelVersioning =
      updateBundlerequestDto.allowsModelVersioning
    foundBundle.allowsCustomTrainingConfig =
      updateBundlerequestDto.allowsCustomTrainingConfig

    await foundBundle.save()

    await this.revokeTokenForBundleUsers(id)

    return new BundlesResponseDto(foundBundle)
  }

  /**
   * This method is used to update the system created bundles only and that have valid id
   * @param {UpdateSystemBundlesDto} updateSystemBundlesDto
   * @returns {BundlesResponseDto[]}
   */
  async updateSystemBundles (updateSystemBundlesDto: UpdateSystemBundlesDto): Promise<BundlesResponseDto[]> {
    const bundlesResponseDto: BundlesResponseDto[] = [];

    for (const bundleUpdate of updateSystemBundlesDto.systemCreatedBundles) {
      const foundBundle = await this.bundlesRepository.findByPk(bundleUpdate.id, {
        attributes: {
          exclude: ['isSystemCreated', 'isActive', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      if (!foundBundle) {
        throw new HttpException('Bundle not found', HttpStatus.NOT_FOUND);
      }
      // checking the system created.
      if (foundBundle.isSystemCreated === false) {
        throw new HttpException('Update not allowed', HttpStatus.METHOD_NOT_ALLOWED);
      }

      if (JSON.stringify(foundBundle) !== JSON.stringify(bundleUpdate)) {
        foundBundle.cost = bundleUpdate.cost
        foundBundle.trainingCost = bundleUpdate.trainingCost
        foundBundle.inferenceCost = bundleUpdate.inferenceCost
        foundBundle.privateDatasets = bundleUpdate.privateDatasets
        foundBundle.privateProjects = bundleUpdate.privateProjects
        foundBundle.maxImages = bundleUpdate.maxImages
        foundBundle.allowsCollaborators = bundleUpdate.allowsCollaborators
        foundBundle.activeLearningCost = bundleUpdate.activeLearningCost
        foundBundle.deployments = bundleUpdate.deployments
        foundBundle.modelDownloadCost = bundleUpdate.modelDownloadCost
        foundBundle.canCloneDataset = bundleUpdate.canCloneDataset
        foundBundle.canCloneProject = bundleUpdate.canCloneProject
        foundBundle.canAccessApis = bundleUpdate.canAccessApis
        foundBundle.cloningRoyalty = bundleUpdate.cloningRoyalty
        foundBundle.smartAnnotationsCost = bundleUpdate.smartAnnotationsCost
        foundBundle.allowsModelVersioning = bundleUpdate.allowsModelVersioning
        foundBundle.allowsCustomTrainingConfig =
          bundleUpdate.allowsCustomTrainingConfig
        await foundBundle.save();

        await this.revokeTokenForBundleUsers(foundBundle.id);
      }

      bundlesResponseDto.push(new BundlesResponseDto(foundBundle));
    }

    return bundlesResponseDto;
  }

  /**
   * This method is used to delete a Bundle record from the DB that have a valid ID and no assigned Users
   * @param {number} id
   */
  async deleteBundle (id: number): Promise<void> {
    const foundBundle = await this.bundlesRepository.findByPk(id)
    if (!foundBundle) {
      throw new HttpException('Bundle not found', HttpStatus.NOT_FOUND)
    }

    if (foundBundle.isSystemCreated === true) {
      throw new HttpException(
        'System created Bundles cannot be deleted',
        HttpStatus.FORBIDDEN
      )
    }

    const findUsersWithBundleId = await this.userRepository.findAll({
      include: {
        model: UserBundle,
        as: 'userBundle',
        where: {
          bundleId: id
        }
      }
    })

    if (findUsersWithBundleId.length > 0) {
      throw new HttpException('Bundle has Users', HttpStatus.NOT_ACCEPTABLE)
    }
    await foundBundle.destroy()
  }

  /**
   * This method is used for new users and will assign them a bundle upon registration
   * @param userId
   * @param bundleId
   */
  async assignBundleToNewUser (userId: number, bundleId: number): Promise<void> {
    const foundUser = await this.userRepository.findByPk(userId)
    const foundBundle = await this.bundlesRepository.findByPk(bundleId)

    if (!foundUser || !foundBundle) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND)
    }

    if (!this.validateCredit(foundUser.id, foundBundle.cost)) {
      throw new HttpException('Not enough credits!', HttpStatus.CONFLICT)
    }

    await this.deductCredit(foundUser.id, foundBundle)

    await this.userBundleService.createOrUpdateUserBundle(
      { bundleId: foundBundle.id, userId: foundUser.id },
      false
    )
  }

  /**
   * This method is used to charge a user with a bundle
   * @param userId
   * @param bundleId
   * @param isNewUser
   * @param req
   */
  async chargeBundleToUserWallet (
    userId: number,
    bundleId: number
  ): Promise<void> {
    const foundUser = await this.userRepository.findByPk(userId, {
      include: {
        model: UserBundle,
        include: [
          {
            model: Bundles
          }
        ]
      }
    })
    const foundBundle = await this.bundlesRepository.findByPk(bundleId)

    if (!foundUser || !foundBundle) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND)
    }

    if (!this.validateCredit(foundUser.id, foundBundle.cost)) {
      throw new HttpException('Not enough credits!', HttpStatus.CONFLICT)
    }

    if (Number(bundleId) === Number(foundUser.userBundle?.bundleId)) {
      throw new HttpException(
        'Already assigned to this bundle!',
        HttpStatus.CONFLICT
      )
    }

    await this.deductCredit(foundUser.id, foundBundle)

    const isBundleLimitExceededRes = await isBundleLimitExceeded(
      userId,
      bundleId
    )

    await this.userBundleService.createOrUpdateUserBundle(
      { bundleId, userId },
      isBundleLimitExceededRes
    )
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
   * @param req
   */
  private async deductCredit (userId: number, bundle: Bundles): Promise<void> {
    const userWallet = await UserWallet.findOne<UserWallet>({
      where: { userId }
    })
    const value = Number(userWallet.value) - Number(bundle.cost)
    // checking if wallet is becoming negative
    if (value < 0) {
      throw new HttpException('Not enough credits!', HttpStatus.CONFLICT)
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

    await UserWalletHistory.sequelize.query(
      'INSERT INTO user_wallet_history_details (user_wallet_history_id, wallet_id, created_at, updated_at, bundle_id) VALUES (:historyId, :walletId, now(), now(), :bundleId)',
      {
        replacements: {
          historyId: walletHistory.id,
          walletId: userWallet.id,
          bundleId: bundle.id
        },
        type: QueryTypes.INSERT
      }
    )
  }

  private async revokeTokenForBundleUsers (bundleId: number): Promise<void> {
    const findUsersWithBundleId = await UserBundle.findAll({
      where: {
        bundleId
      },
      attributes: ['userId']
    })

    if (findUsersWithBundleId.length > 0) {
      findUsersWithBundleId.forEach((userBundle) =>
        this.userAuthTokenService.deleteAllUserAuthTokens(userBundle.userId)
      )
    }
  }
}
