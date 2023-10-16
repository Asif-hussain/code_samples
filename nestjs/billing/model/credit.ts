import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { AmountTypeEnum } from '../dto/enum/amountTypeEnum';

@Table({ modelName: 'credits' })
export class Credit extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    })
      id: string

      @Column({
        type: DataType.ENUM(
          AmountTypeEnum.USD,
          AmountTypeEnum.SAR
        ),
        field: 'amount_type'
      })
        amountType :AmountTypeEnum

    @Column
      amount :number

    @Column
      credit: number

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
