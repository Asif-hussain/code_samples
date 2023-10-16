import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
@Table({ modelName: 'company_employees' })
export class CompanyEmployee extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    })
      id: string

    @Column({ field: 'name_en' })
      nameEn: string

    @Column({ field: 'name_ar' })
      nameAr: string

    @Column
      image: string

    @Column
      position: string

    @Column({ field: 'position_ar' })
      positionAr: string

    @Column
      email: string

    @Column
      linkedin: string

    @Column
      github: string

    @Column
      twitter: string

    @Column
      facebook: string

    @Column
      instagram: string

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
