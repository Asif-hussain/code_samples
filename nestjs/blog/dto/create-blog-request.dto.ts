import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateBlogRequestDto {
  @ApiProperty()
  @IsDefined()
  readonly tag: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly readingTime: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly publishedDate: Date

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly publishedTime: string

  @ApiProperty()
  @IsDefined()
  readonly status: any

  @ApiProperty()
  @IsDefined()
  readonly isScheduled: any

  @ApiProperty()
  @IsDefined()
  readonly author: string

  @ApiProperty()
  @IsDefined()
  readonly slugEn: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly slugAr: string

  @ApiProperty()
  @IsDefined()
  readonly articleTitleEn: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly articleTitleAr: string

  @ApiProperty()
  @IsDefined()
  readonly descriptionEn: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly descriptionAr: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly metaDescriptionEn: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly metaKeywordsEn: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly metaDescriptionAr: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly metaKeywordsAr: string

  @ApiProperty({
    description: 'Image',
    type: 'file'
  })
  @ApiModelPropertyOptional({ description: 'Image' })
    image: any[]
}
