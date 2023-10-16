import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ modelName: 'blog_authors' })
export class BlogAuthor extends Model {
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

    @Column({ field: 'bio_en' })
      bioEn: string

    @Column({ field: 'bio_ar' })
      bioAr: string

    @Column
      status: boolean

    @Column
      image: string

    @Column
      linkedIn: string

    @Column
      github: string

    @Column
      behance: string

    @Column
      twitter: string

    @Column
      instagram: string

    @Column
      facebook: string

    @Column
      youtube: string

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
