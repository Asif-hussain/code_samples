import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'

export class CreateCompanyEmployeeRequestDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly nameEn: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly nameAr?: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly positionEn: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly positionAr?: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly email: string

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
  readonly twitter?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly facebook?: string

  @ApiProperty()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly instagram?: string

  @ApiProperty({
    description: 'Member Image',
    type: 'file'
  })
  @ApiModelPropertyOptional({ description: 'Member Image' })
    image: any[]
}
