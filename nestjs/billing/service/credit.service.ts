import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/service/base.service';
import { Credit } from '../model/credit';

@Injectable()
export class CreditService extends BaseService {
  constructor (
        @Inject('CREDIT_REPOSITORY')
        private creditRepository: typeof Credit
  ) {
    super()
  }

  // get all credit packages
  async getAllCreditDetails () {
    const allCreditDetails = await this.creditRepository.findAll({
      where: { deletedAt: null }
    })

    return allCreditDetails
  }
}
