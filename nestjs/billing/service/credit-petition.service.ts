import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { config } from '../../../config'
import { BaseService } from '../../shared/service/base.service'
import { MailService } from '../../shared/service/mail.service'
import { User } from '../../users/model/user.model'
import { CreditPetitionRequestDto } from '../dto/credit-petition.request.dto'

@Injectable()
export class CreditPetitionService extends BaseService {
  constructor (private mailService: MailService) {
    super()
  }

  /**
   * The following method is used to send an email to Thya Tech admin team for a user's petition for credits
   * @param {CreditPetitionRequestDto} request
   * @param {User} user
   */
  sendCreditPetitionEmail (request: CreditPetitionRequestDto, user: User): void {
    try {
      this.mailService.sendEmail(
        './src/billing/template/mail/customer-credit-petition',
        config.kasutAdminEmail,
        'Thya Technology - User Credit Petition',
        {
          username: `${user.firstName} ${user.lastName}`,
          package: `${request.amount} ${request.amountType}`,
          email: user.email,
          credit: request.credit,
          cdnLink: config.cdnUrl,
          url: `${config.cmsPortalUrl}/crm/${user.id}`
        }
      )
    } catch (error) {
      throw new HttpException(
        'Oops! Something went Wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
