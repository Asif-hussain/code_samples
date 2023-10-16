import { ApiProperty } from '@nestjs/swagger'
import { Role } from '../../shared/enum/role'
import { BaseDto } from '../../shared/dto/base.dto'
import { AccountTypeEnum } from '../enum/accountTypeEnum'
import { FieldOfUseEnum } from '../enum/fieldOfUseEnum'
import { User } from '../../users/model/user.model'

export class CustomerDto extends BaseDto {
  @ApiProperty()
    id: number

  @ApiProperty()
  readonly email: string

  @ApiProperty()
  readonly firstName: string

  @ApiProperty()
  readonly lastName: string

  @ApiProperty()
  readonly role: Role

  @ApiProperty()
  readonly phoneNumber?: string

  @ApiProperty()
  readonly position: string

  @ApiProperty()
  readonly moreInfo?: string

  @ApiProperty()
  readonly companyWebsite?: string

  @ApiProperty()
  readonly accountType: AccountTypeEnum

  @ApiProperty()
  readonly fieldOfUse: FieldOfUseEnum

  @ApiProperty()
  readonly dob: String

  constructor (customer: User) {
    super()
    this.id = customer.id
    this.firstName = customer.firstName
    this.lastName = customer.lastName
    this.role = customer.role
    this.dob = customer.dob
    this.companyWebsite = customer.companyWebsite
    this.accountType = customer.accountType
    this.fieldOfUse = customer.fieldOfUse
    this.phoneNumber = customer.phoneNumber
    this.position = customer.position
    this.moreInfo = customer.moreInfo
    this.active = customer.active
    this.createdAt = customer.createdAt
    this.updatedAt = customer.updatedAt
  }
}
