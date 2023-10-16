import { BaseDto } from '../../shared/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BlogAuthorDto } from './blog-author.dto';
import { Blog } from '../model/blog.model';
import { BlogTagDto } from '../../tags/dto/blog.tag.dto';
import { config } from '../../../config'
import { CloudStorageTypes } from '../../shared/enum/cloud-storage-types'
export class BlogDto extends BaseDto {
    @ApiProperty()
      id: string

    @ApiProperty()
      image: string

    @ApiProperty()
      readingTime: string

    @ApiProperty()
      publishedDate: Date

    @ApiProperty()
      publishedTime: string

    @ApiProperty()
      status: boolean

    @ApiProperty()
      isScheduled: boolean

    @ApiProperty()
      blogAuthor: BlogAuthorDto

    @ApiProperty()
      slugEn: string

    @ApiProperty()
      slugAr: string

    @ApiProperty()
      articleTitleEn: string

    @ApiProperty()
      articleTitleAr: string

    @ApiProperty()
      descriptionEn: string

    @ApiProperty()
      descriptionAr: string

    @ApiProperty()
      metaDescriptionEn: string

    @ApiProperty()
      metaKeywordsEn: string

    @ApiProperty()
      metaDescriptionAr: string

    @ApiProperty()
      metaKeywordsAr: string

    @ApiProperty()
    readonly tags: BlogTagDto[]

    constructor (blog: Blog) {
      super()

      this.id = blog.id
      this.image = blog.image ? config.cloudStorageService === CloudStorageTypes.minio ? config.minIofilePath + blog.image : blog.image : null
      this.tags =
            blog.tags?.map(function (val) {
              return new BlogTagDto(val.tagObject)
            }) ?? []
      this.readingTime = blog.readingTime
      this.publishedDate = blog.publishedDate
      this.publishedTime = blog.publishedTime
      this.status = blog.status
      this.isScheduled = blog.isScheduled
      this.blogAuthor = blog.blogAuthor ? new BlogAuthorDto(blog.blogAuthor) : null
      this.slugEn = blog.slugEn
      this.slugAr = blog.slugAr
      this.articleTitleEn = blog.articleTitleEn
      this.articleTitleAr = blog.articleTitleAr
      this.descriptionEn = blog.descriptionEn
      this.descriptionAr = blog.descriptionAr
      this.metaDescriptionEn = blog.metaDescriptionEn
      this.metaKeywordsEn = blog.metaKeywordsEn
      this.metaDescriptionAr = blog.metaDescriptionAr
      this.metaKeywordsAr = blog.metaKeywordsAr
      this.createdAt = blog.createdAt
      this.updatedAt = blog.updatedAt
    }
}
