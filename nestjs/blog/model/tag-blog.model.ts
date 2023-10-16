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
import { Blog } from './blog.model';
import { BlogTag } from '../../tags/model/blog-tag.model';

@Table({ modelName: 'tag_blogs' })
export class TagBlog extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    })
      id: string

    @ForeignKey(() => Blog)
    @Column({
      type: DataType.INTEGER,
      field: 'blog_id'
    })
    public blogId: number

    @BelongsTo(() => Blog)
      blogObject: Blog

    @ForeignKey(() => BlogTag)
    @Column({
      type: DataType.INTEGER,
      field: 'tag_id'
    })
    public tagId: number

    @BelongsTo(() => BlogTag)
      tagObject: BlogTag

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
