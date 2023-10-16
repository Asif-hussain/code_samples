import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { BaseService } from '../../shared/service/base.service';
import { CreateCompanyTeamRequestDto } from '../dto/create-company-team-request.dto';
import { CompanyTeam } from '../model/company-team.model';
import { CloudStorageService } from '../../shared/service/cloudStorage.service';
import { CompanyTeamDto } from '../dto/company-team.dto';
import { TagListingRequestDto } from '../../tags/dto/tag-listing-request.dto';
import { WhereAttributeHash } from 'sequelize/types/model';
import sequelize, { Op, QueryTypes } from 'sequelize';
import { PageResponseDto } from '../../shared/dto/page-response.dto';

export class CompanyTeamService extends BaseService {
  constructor (
        @Inject('COMPANY_TEAM_REPOSITORY')
        private companyTeamRepository: typeof CompanyTeam,
        private readonly cloudStorage: CloudStorageService

  ) {
    super()
  }

  // create company team member
  async createTeamMember (request: CreateCompanyTeamRequestDto, file: any) {
    const query = await this.companyTeamRepository.sequelize.query('select * from company_teams where lower(email) = :email',
      { replacements: { email: request.email.trimEnd().toLowerCase() }, type: QueryTypes.SELECT, raw: true, logging: true })

    if (query.length > 0) {
      throw new HttpException(
        'Email already exists',
        HttpStatus.CONFLICT
      )
    }

    const companyTeam = new CompanyTeam()
    companyTeam.nameEn = request.nameEn
    companyTeam.nameAr = request.nameAr
    companyTeam.position = request.positionEn
    companyTeam.positionAr = request.positionAr
    companyTeam.text = request.descriptionEn
    companyTeam.textAr = request.descriptionAr
    companyTeam.email = request.email
    companyTeam.linkedin = request.linkedIn
    companyTeam.twitter = request.twitter
    companyTeam.facebook = request.facebook
    companyTeam.instagram = request.instagram
    companyTeam.github = request.github
    const data = await companyTeam.save()

    if (file) {
      companyTeam.image = await this.cloudStorage.prop.uploadFile(
        file,
        this.cloudStorage.publicBucket,
        data.id.toString(),
        'company-team-pictures'
      )
      await companyTeam.save()
    }

    return await this.getOne(companyTeam.id)
  }

  // update company team member
  async updateTeamMember (id: string, request: CreateCompanyTeamRequestDto, file: any) {
    const companyTeam = await this.companyTeamRepository.findByPk<CompanyTeam>(id)
    if (!companyTeam) {
      throw new HttpException('Team member not found.', HttpStatus.NOT_FOUND)
    }

    const query = await this.companyTeamRepository.sequelize.query('select * from company_teams where lower(email) = :email and id != :id',
      { replacements: { email: request.email.trimEnd().toLowerCase(), id }, type: QueryTypes.SELECT, raw: true, logging: true })

    if (query.length > 0) {
      throw new HttpException(
        'Email already exists',
        HttpStatus.CONFLICT
      )
    }

    companyTeam.nameEn = request.nameEn
    companyTeam.nameAr = request.nameAr
    companyTeam.position = request.positionEn
    companyTeam.positionAr = request.positionAr
    companyTeam.text = request.descriptionEn
    companyTeam.textAr = request.descriptionAr
    companyTeam.email = request.email
    companyTeam.linkedin = request.linkedIn
    companyTeam.twitter = request.twitter
    companyTeam.facebook = request.facebook
    companyTeam.instagram = request.instagram
    companyTeam.github = request.github
    const data = await companyTeam.save()

    if (file) {
      companyTeam.image = await this.cloudStorage.prop.uploadFile(
        file,
        this.cloudStorage.publicBucket,
        data.id.toString(),
        'company-team-pictures'
      )
      await companyTeam.save()
    }

    return await this.getOne(id)
  }

  // get one record
  async getOne (id: string) {
    const member = await this.companyTeamRepository.findByPk<CompanyTeam>(id)

    if (!member) {
      throw new HttpException('Team member not found.', HttpStatus.NOT_FOUND)
    }

    return new CompanyTeamDto(member)
  }

  // remove a member
  async deleteMember (id :string) {
    const member = await this.companyTeamRepository.findByPk<CompanyTeam>(id)

    if (!member) {
      throw new HttpException('Team member not found.', HttpStatus.NOT_FOUND)
    }

    await member.destroy()
  }

  // get all records
  async getAll (request: TagListingRequestDto) {
    const searchOrCondition: WhereAttributeHash = []
    // if the search query is provided
    if (request.search) {
      searchOrCondition.push(sequelize.where(
        sequelize.cast(sequelize.col('company_teams.id'), 'varchar'),
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
    const members: { rows: CompanyTeam[]; count: number } =
            await this.companyTeamRepository.findAndCountAll(
              this.getFindAllOptions(request, where, [])
            )
    return new PageResponseDto(
      members.rows.map((member) => new CompanyTeamDto(member)),
      members.count,
      request.page,
      request.size
    )
  }
}
