import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ modelName: 'rates' })
export class Rate extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    })
      id: string

    @Column({ field: 'training_rate' })
      trainingRate :number

    @Column({ field: 'inference_rate' })
      inferenceRate :number

    @Column({ field: 'free_credits' })
      freeCredits :number

    @Column({ field: 'dataset_default_fee' })
      datasetDefaultFee :number

    @Column({ field: 'project_default_fee' })
      projectDefaultFee :number

    @Column
      active: boolean

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
