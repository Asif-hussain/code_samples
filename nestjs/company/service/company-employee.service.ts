import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { BaseService } from '../../shared/service/base.service';
import { CreateCompanyEmployeeRequestDto } from '../dto/create-company-employee-request.dto';
import { CompanyEmployee } from '../model/company-employee.model';
import { CloudStorageService } from '../../shared/service/cloudStorage.service';
import { CompanyEmployeeDto } from '../dto/company-employee.dto';
import { TagListingRequestDto } from '../../tags/dto/tag-listing-request.dto';
import { WhereAttributeHash } from 'sequelize/types/model';
import sequelize, { Op, QueryTypes } from 'sequelize';
import { PageResponseDto } from '../../shared/dto/page-response.dto';

export class CompanyEmployeeService extends BaseService {
  constructor (
        @Inject('COMPANY_EMPLOYEE_REPOSITORY')
        private companyEmployeeRepository: typeof CompanyEmployee,
        private readonly cloudStorage: CloudStorageService

  ) {
    super()
  }

  // create company team member
  async createEmployeeMember (request: CreateCompanyEmployeeRequestDto, file: any) {
    const query = await this.companyEmployeeRepository.sequelize.query('select * from company_employees where lower(email) = :email',
      { replacements: { email: request.email.trimEnd().toLowerCase() }, type: QueryTypes.SELECT, raw: true, logging: true })

    if (query.length > 0) {
      throw new HttpException(
        'Email already exists',
        HttpStatus.CONFLICT
      )
    }

    const companyEmployee = new CompanyEmployee()
    companyEmployee.nameEn = request.nameEn
    companyEmployee.nameAr = request.nameAr
    companyEmployee.position = request.positionEn
    companyEmployee.positionAr = request.positionAr
    companyEmployee.email = request.email
    companyEmployee.linkedin = request.linkedIn
    companyEmployee.github = request.github
    companyEmployee.twitter = request.twitter
    companyEmployee.facebook = request.facebook
    companyEmployee.instagram = request.instagram
    const data = await companyEmployee.save()

    if (file) {
      companyEmployee.image = await this.cloudStorage.prop.uploadFile(
        file,
        this.cloudStorage.publicBucket,
        data.id.toString(),
        'company-team-employees'
      )
      await companyEmployee.save()
    }

    return await this.getOne(companyEmployee.id)
  }

  // update company team member
  async updateEmployeeMember (id: string, request: CreateCompanyEmployeeRequestDto, file: any) {
    const companyEmployee = await this.companyEmployeeRepository.findByPk<CompanyEmployee>(id)
    if (!companyEmployee) {
      throw new HttpException('Employee member not found.', HttpStatus.NOT_FOUND)
    }

    const query = await this.companyEmployeeRepository.sequelize.query('select * from company_employees where lower(email) = :email and id != :id',
      { replacements: { email: request.email.trimEnd().toLowerCase(), id }, type: QueryTypes.SELECT, raw: true, logging: true })

    if (query.length > 0) {
      throw new HttpException(
        'Email already exists',
        HttpStatus.CONFLICT
      )
    }

    companyEmployee.nameEn = request.nameEn
    companyEmployee.nameAr = request.nameAr
    companyEmployee.position = request.positionEn
    companyEmployee.positionAr = request.positionAr
    companyEmployee.email = request.email
    companyEmployee.linkedin = request.linkedIn
    companyEmployee.github = request.github
    companyEmployee.twitter = request.twitter
    companyEmployee.facebook = request.facebook
    companyEmployee.instagram = request.instagram
    const data = await companyEmployee.save()

    if (file) {
      companyEmployee.image = await this.cloudStorage.prop.uploadFile(
        file,
        this.cloudStorage.publicBucket,
        data.id.toString(),
        'company-team-employees'
      )
      await companyEmployee.save()
    }

    return await this.getOne(id)
  }

  // get one record
  async getOne (id: string) {
    const member = await this.companyEmployeeRepository.findByPk<CompanyEmployee>(id)

    if (!member) {
      throw new HttpException('Employee member not found.', HttpStatus.NOT_FOUND)
    }

    return new CompanyEmployeeDto(member)
  }

  // remove a member
  async deleteMember (id :string) {
    const member = await this.companyEmployeeRepository.findByPk<CompanyEmployee>(id)

    if (!member) {
      throw new HttpException('Employee member not found.', HttpStatus.NOT_FOUND)
    }

    await member.destroy()
  }

  // get all records
  async getAll (request: TagListingRequestDto) {
    const searchOrCondition: WhereAttributeHash = []
    // if the search query is provided
    if (request.search) {
      searchOrCondition.push(sequelize.where(
        sequelize.cast(sequelize.col('company_employees.id'), 'varchar'),
        { [Op.iLike]: `%${request.search}%` }
      ))
      searchOrCondition.push({
        nameEn: { [Op.iLike]: `%${request.search}%` }
      })
      searchOrCondition.push({
        position: { [Op.iLike]: `%${request.search}%` }
      })
    }

    let where: any = this.whereCondition

    if (searchOrCondition.length > 0) {
      where = {
        [Op.and]: [{ [Op.or]: searchOrCondition }, this.whereCondition]
      }
    }

    // performing the find count all to find all the results
    const members: { rows: CompanyEmployee[]; count: number } =
            await this.companyEmployeeRepository.findAndCountAll(
              this.getFindAllOptions(request, where, [])
            )
    return new PageResponseDto(
      members.rows.map((member) => new CompanyEmployeeDto(member)),
      members.count,
      request.page,
      request.size
    )
  }
}
