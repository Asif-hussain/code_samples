import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey, HasMany,
  Model,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { BlogAuthor } from './blog-author.model';
import { TagBlog } from './tag-blog.model';

@Table({ modelName: 'blogs' })
export class Blog extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    })
      id: string

    @HasMany(() => TagBlog)
      tags: TagBlog[]

    @Column
      image: string

    @Column({ field: 'reading_time' })
      readingTime: string

    @Column({ field: 'published_date' })
      publishedDate: Date

    @Column({ field: 'published_time' })
      publishedTime: string

    @Column
      status: boolean

    @Column({ field: 'is_scheduled' })
      isScheduled: boolean

    @ForeignKey(() => BlogAuthor)
    @Column({
      type: DataType.INTEGER,
      field: 'author'
    })
    public author: number

    @BelongsTo(() => BlogAuthor)
      blogAuthor: BlogAuthor

    @Column({ field: 'slug_en' })
      slugEn: string

    @Column({ field: 'slug_ar' })
      slugAr: string

    @Column({ field: 'article_title_en' })
      articleTitleEn: string

    @Column({ field: 'article_title_ar' })
      articleTitleAr: string

    @Column({ field: 'description_en' })
      descriptionEn: string

    @Column({ field: 'description_ar' })
      descriptionAr: string

    @Column({ field: 'meta_keywords_en' })
      metaKeywordsEn: string

    @Column({ field: 'meta_description_en' })
      metaDescriptionEn: string

    @Column({ field: 'meta_keywords_ar' })
      metaKeywordsAr: string

    @Column({ field: 'meta_description_ar' })
      metaDescriptionAr: string

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
