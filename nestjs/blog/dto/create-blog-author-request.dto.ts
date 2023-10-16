import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateBlogAuthorRequestDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly nameEn: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly nameAr: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly bioEn: string

  @ApiProperty()
  @IsDefined()
  readonly status: any

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly bioAr?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly linkedIn?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly github?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly behance?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly twitter?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly instagram?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly facebook?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly youtube?: string

  @ApiProperty({
    description: 'Image',
    type: 'file'
  })
  @ApiModelPropertyOptional({ description: 'Image' })
    image: any[]
}
