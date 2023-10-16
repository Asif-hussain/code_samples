import { BaseDto } from '../../shared/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BlogAuthor } from '../model/blog-author.model';
import { config } from '../../../config'
import { CloudStorageTypes } from '../../shared/enum/cloud-storage-types'

export class BlogAuthorDto extends BaseDto {
    @ApiProperty()
      id: string

    @ApiProperty()
      nameEn: string

    @ApiProperty()
      nameAr: string

    @ApiProperty()
      bioEn: string

    @ApiProperty()
      bioAr: string

    @ApiProperty()
      image: string

    @ApiProperty()
      status: boolean

    @ApiProperty()
      linkedIn: string

    @ApiProperty()
      github: string

    @ApiProperty()
      behance: string

    @ApiProperty()
      twitter: string

    @ApiProperty()
      instagram: string

    @ApiProperty()
      facebook: string

    @ApiProperty()
      youtube: string

    constructor (blogAuthor: BlogAuthor) {
      super()

      this.id = blogAuthor.id
      this.nameEn = blogAuthor.nameEn
      this.nameAr = blogAuthor.nameAr
      this.bioEn = blogAuthor.bioEn
      this.bioAr = blogAuthor.bioAr
      this.status = blogAuthor.status
      this.image = blogAuthor.image ? config.cloudStorageService === CloudStorageTypes.minio ? config.minIofilePath + blogAuthor.image : blogAuthor.image : null
      this.linkedIn = blogAuthor.linkedIn
      this.github = blogAuthor.github
      this.behance = blogAuthor.behance
      this.twitter = blogAuthor.twitter
      this.instagram = blogAuthor.instagram
      this.facebook = blogAuthor.facebook
      this.youtube = blogAuthor.youtube
    }
}
