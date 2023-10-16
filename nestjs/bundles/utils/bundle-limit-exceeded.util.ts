import { Op } from 'sequelize'
import { Dataset } from '../../datasets/model/dataset.model'
import { Bundles } from '../model/bundles.model'
import { Project } from '../../projects/model/project/project.model'
import { DatasetImage } from '../../datasets/model/dataset-image.model'
import { BatchInference } from '../../projects/model/project/batch-inference.model'
import { UserBundle } from '../model/user-bundle.model'
import { HttpException, HttpStatus } from '@nestjs/common'
import { DatasetUser } from '../../datasets/model/dataset-user.model'
import { DatasetRoles } from '../../datasets/enum/datasetRoles'
import { ProjectUser } from '../../projects/model/project/project-user.model'
import { ProjectRoles } from '../../projects/enum/projectRoles'

export async function isBundleLimitExceeded (
  userId: number,
  bundleId: number
): Promise<boolean> {
  // Get the user Bundle maybe it is changes as user have loged in some time ago
  const userBundle = await findUserBundle(userId)
  let isLimitExceeded = false
  const userPrivateDataSets = await Dataset.findAll({
    attributes: ['id'],
    where: {
      isPublic: false
    },
    include: {
      model: DatasetUser,
      where: {
        [Op.and]: {
          userId,
          role: DatasetRoles.owner
        }
      }
    }
  })

  // we can prevent later queries if we already exceeded limits here.
  if (userBundle.bundle.privateDatasets === null) {
    isLimitExceeded = userPrivateDataSets.length > 0
  } else {
    isLimitExceeded = userPrivateDataSets.length > userBundle.bundle.privateDatasets
  }
  if (isLimitExceeded) {
    await updateBundleLimits(userId, bundleId, isLimitExceeded)
    return isLimitExceeded
  }

  const userPrivateProjects = await Project.findAll({
    where: {
      isPublic: false
    },
    include: {
      model: ProjectUser,
      where: {
        [Op.and]: {
          userId,
          role: ProjectRoles.owner
        }
      }
    }
  })

  if (userBundle.bundle.privateProjects === null) {
    isLimitExceeded = userPrivateProjects.length > 0
  } else {
    isLimitExceeded = userPrivateProjects.length > userBundle.bundle.privateProjects
  }
  if (isLimitExceeded) {
    await updateBundleLimits(userId, bundleId, isLimitExceeded)
    return isLimitExceeded
  }

  let totalDatasetImagesCount = await DatasetImage.count({
    where: { datasetId: { [Op.in]: userPrivateDataSets.map(dataset => dataset.id) } }
  })

  if (userBundle.bundle.maxImages === null) {
    isLimitExceeded = totalDatasetImagesCount > 0
  } else {
    isLimitExceeded = totalDatasetImagesCount > userBundle.bundle.maxImages;
  }

  if (isLimitExceeded) {
    await updateBundleLimits(userId, bundleId, isLimitExceeded)
    return isLimitExceeded;
  }

  // Get the sum of no_of_images using the count aggregate function
  const sumOfBatchInferenceImages = await BatchInference.sum('no_of_images', {
    where: {
      userId
    }
  })

  totalDatasetImagesCount += sumOfBatchInferenceImages;

  if (userBundle.bundle.maxImages === null) {
    isLimitExceeded = totalDatasetImagesCount > 0
  } else {
    isLimitExceeded = totalDatasetImagesCount > userBundle.bundle.maxImages
  }
  if (isLimitExceeded) {
    await updateBundleLimits(userId, bundleId, isLimitExceeded)
    return isLimitExceeded;
  }

  await updateBundleLimits(userId, bundleId, isLimitExceeded)
  return isLimitExceeded
}

/**
 * This method is used to updated the user Bundle limits
 * @param userId
 * @param bundleId
 * @param isLimitExceeded
 * @returns
 */

export async function updateBundleLimits (userId: number, bundleId: number, isLimitExceeded: boolean) {
  try {
    const userBundle = await UserBundle.findOne({
      where: {
        userId
      }
    })
    if (!userBundle) {
      throw new HttpException('user Bundle not found.', HttpStatus.NOT_FOUND)
    }
    userBundle.isLimitExceeded = isLimitExceeded
    await userBundle.save()
  } catch (error) {
    throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
/**
 * This method would be used to fetch user latest bundle
 * @param userId
 */
export async function findUserBundle (userId: number) {
  try {
    const foundUserBundle = await UserBundle.findOne<UserBundle>({
      include: {
        model: Bundles
      },
      where: { userId }
    })
    return foundUserBundle
  } catch (error) {
    throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
