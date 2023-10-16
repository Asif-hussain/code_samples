import { Column, CreatedAt, DataType, DeletedAt, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { UserBundle } from './user-bundle.model';

@Table({
  tableName: 'bundles'
})
export class Bundles extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
    id: number;

  @Column({
    field: 'name',
    type: DataType.STRING(255),
    allowNull: false,
    unique: true
  })
    name: string;

  @Column({
    field: 'is_system_created',
    type: DataType.BOOLEAN,
    allowNull: false
  })
    isSystemCreated: boolean;

  @Column({
    field: 'cost',
    type: DataType.FLOAT,
    allowNull: false
  })
    cost: number;

  @Column({
    field: 'training_cost',
    type: DataType.FLOAT
  })
    trainingCost: number;

  @Column({
    field: 'inference_cost',
    type: DataType.FLOAT
  })
    inferenceCost: number;

  @Column({
    field: 'private_datasets',
    type: DataType.FLOAT
  })
    privateDatasets: number;

  @Column({
    field: 'private_projects',
    type: DataType.FLOAT
  })
    privateProjects: number;

  @Column({
    field: 'max_images',
    type: DataType.DECIMAL(10, 2)
  })
    maxImages: number;

  @Column({
    field: 'allows_collaborators',
    type: DataType.BOOLEAN,
    defaultValue: false
  })
    allowsCollaborators: boolean;

  @Column({
    field: 'active_learning_cost',
    type: DataType.FLOAT
  })
    activeLearningCost: number;

  @Column({
    field: 'smart_annotations_cost',
    type: DataType.FLOAT
  })
    smartAnnotationsCost: number;

  @Column({
    field: 'deployments',
    type: DataType.DECIMAL(10, 2)
  })
    deployments: number;

  @Column({
    field: 'model_download_cost',
    type: DataType.FLOAT
  })
    modelDownloadCost: number;

  @Column({
    field: 'can_clone_dataset',
    type: DataType.BOOLEAN,
    defaultValue: false
  })
    canCloneDataset: boolean;

  @Column({
    field: 'can_clone_project',
    type: DataType.BOOLEAN,
    defaultValue: false
  })
    canCloneProject: boolean;

  @Column({
    field: 'cloning_royalty',
    type: DataType.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  })
    cloningRoyalty: number;

  @Column({
    field: 'can_access_apis',
    type: DataType.BOOLEAN,
    defaultValue: false
  })
    canAccessApis: boolean;

  @Column({
    field: 'allows_model_versioning',
    type: DataType.BOOLEAN,
    defaultValue: false
  })
    allowsModelVersioning: boolean;

  @Column({
    field: 'allows_custom_training_config',
    type: DataType.BOOLEAN,
    defaultValue: false
  })
    allowsCustomTrainingConfig: boolean;

  @Column({
    field: 'is_active',
    type: DataType.BOOLEAN,
    defaultValue: true
  })
    isActive: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
    createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
    updatedAt: Date

  @DeletedAt
  @Column({ field: 'deleted_at' })
    deletedAt: Date

  @HasMany(() => UserBundle)
    userBundles: UserBundle[]
}
