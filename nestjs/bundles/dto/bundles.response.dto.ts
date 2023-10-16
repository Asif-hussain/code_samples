import { ApiProperty } from '@nestjs/swagger'
import { Bundles } from '../model/bundles.model'
import { BaseDto } from '../../shared/dto/base.dto'

export class BundlesResponseDto extends BaseDto {
  @ApiProperty()
    id: number

  @ApiProperty()
    name: string

  @ApiProperty()
    cost: number

  @ApiProperty()
    trainingCost: number

  @ApiProperty()
    inferenceCost: number

  @ApiProperty()
    privateDatasets: number

  @ApiProperty()
    privateProjects: number

  @ApiProperty()
    maxImages: number

  @ApiProperty()
    allowsCollaborators: boolean

  @ApiProperty()
    activeLearningCost: number

  @ApiProperty()
    smartAnnotationsCost: number

  @ApiProperty()
    deployments: number

  @ApiProperty()
    modelDownloadCost: number

  @ApiProperty()
    canCloneDataset: boolean

  @ApiProperty()
    canCloneProject: boolean

  @ApiProperty()
    cloningRoyalty: number

  @ApiProperty()
    canAccessApis: boolean

  @ApiProperty()
    allowsModelVersioning: boolean

  @ApiProperty()
    allowsCustomTrainingConfig: boolean

  @ApiProperty()
    isActive: boolean

  @ApiProperty()
    createdAt: Date

  @ApiProperty()
    updatedAt: Date

  @ApiProperty()
    deletedAt: Date

  constructor (bundles: Bundles) {
    super()
    this.id = bundles.id
    this.name = bundles.name
    this.cost = bundles.cost
    this.trainingCost = bundles.trainingCost
    this.inferenceCost = bundles.inferenceCost
    this.privateDatasets = bundles.privateDatasets
    this.privateProjects = bundles.privateProjects
    this.maxImages = bundles.maxImages
    this.allowsCollaborators = bundles.allowsCollaborators
    this.activeLearningCost = bundles.activeLearningCost
    this.smartAnnotationsCost = bundles.smartAnnotationsCost
    this.deployments = bundles.deployments
    this.modelDownloadCost = bundles.modelDownloadCost
    this.canCloneDataset = bundles.canCloneDataset
    this.canCloneProject = bundles.canCloneProject
    this.cloningRoyalty = bundles.cloningRoyalty
    this.canAccessApis = bundles.canAccessApis
    this.allowsModelVersioning = bundles.allowsModelVersioning
    this.allowsCustomTrainingConfig = bundles.allowsCustomTrainingConfig
    this.isActive = bundles.isActive
  }
}
