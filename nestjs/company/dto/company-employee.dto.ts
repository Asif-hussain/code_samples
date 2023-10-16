import { BaseDto } from '../../shared/dto/base.dto'
import { ApiProperty } from '@nestjs/swagger'
import { CompanyEmployee } from '../model/company-employee.model';
import { config } from '../../../config'
import { CloudStorageTypes } from '../../shared/enum/cloud-storage-types'

export class CompanyEmployeeDto extends BaseDto {
    @ApiProperty()
      id: string

    @ApiProperty()
      image: string

    @ApiProperty()
    readonly nameEn: string

    @ApiProperty()
    readonly nameAr: string

    @ApiProperty()
    readonly positionEn: string

    @ApiProperty()
    readonly positionAr: string

    @ApiProperty()
    readonly email: string

    @ApiProperty()
    readonly linkedIn: string

    @ApiProperty()
    readonly github: string

    @ApiProperty()
    readonly twitter: string

    @ApiProperty()
    readonly facebook: string

    @ApiProperty()
    readonly instagram: string

    constructor (team: CompanyEmployee) {
      super()
      this.id = team.id
      this.image = team.image ? config.cloudStorageService === CloudStorageTypes.minio ? config.minIofilePath + team.image : team.image : null
      this.nameEn = team.nameEn
      this.nameAr = team.nameAr
      this.email = team.email
      this.positionEn = team.position
      this.positionAr = team.positionAr
      this.linkedIn = team.linkedin
      this.github = team.github
      this.twitter = team.twitter
      this.facebook = team.facebook
      this.instagram = team.instagram
    }
}
