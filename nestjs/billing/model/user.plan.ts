import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Plan } from './plan';
import { User } from '../../users/model/user.model';

@Table({ modelName: 'user_plans' })
export class UserPlan extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    })
      id: string

    @ForeignKey(() => User)
    @Column({
      type: DataType.UUID,
      field: 'user_id'
    })
    public userId: number

    @BelongsTo(() => User)
      user: User

    @ForeignKey(() => Plan)
    @Column({
      type: DataType.INTEGER,
      field: 'plan_id'
    })
    public planId: number

    @BelongsTo(() => Plan)
      plan: Plan

    @Column({ field: 'private_project_remaining' })
      privateProjectRemaining :number

    @Column({ field: 'training_remaining' })
      trainingRemaining :number

    @Column({ field: 'inferences_remaining' })
      inferencesRemaining :number

    @Column
      completed : boolean

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
