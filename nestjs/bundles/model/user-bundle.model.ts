import { Column, DataType, ForeignKey, CreatedAt, UpdatedAt, DeletedAt, BelongsTo, Model, Table } from 'sequelize-typescript';
import { Bundles } from './bundles.model';
import { User } from '../../users/model/user.model';

@Table({
  tableName: 'user_bundles'
})
export class UserBundle extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
    id: number

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'user_id'
  })
    userId: number

  @BelongsTo(() => User, { as: 'userBundle' })
    user: User;

  @ForeignKey(() => Bundles)
  @Column({
    type: DataType.INTEGER,
    field: 'bundle_id'
  })
    bundleId: number

  @BelongsTo(() => Bundles) // Define association
    bundle: Bundles

  @Column({
    field: 'active',
    type: DataType.BOOLEAN,
    allowNull: false
  })
    active: boolean

  @Column({
    field: 'is_limit_exceeded',
    type: DataType.BOOLEAN,
    allowNull: false
  })
    isLimitExceeded: boolean

  @Column({ field: 'bundle_purchase_date' })
    bundlePurchaseDate: Date

  @Column({ field: 'next_billing_date' })
    nextBillingDate: Date

  @Column({ field: 'bundle_purchase_cost' })
    bundlePurchaseCost: number

  @CreatedAt
  @Column({ field: 'created_at' })
    createdAt: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
    updatedAt: Date

  @DeletedAt
  @Column({ field: 'deleted_at' })
    deletedAt: Date
}
