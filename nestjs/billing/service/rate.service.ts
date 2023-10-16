import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/service/base.service';
import { Rate } from '../model/rate';
import { RateDto } from '../dto/rate.dto';
import { UpdateRateRequest } from '../dto/update.rate.request';

@Injectable()
export class RateService extends BaseService {
  constructor (
        @Inject('RATE_REPOSITORY')
        private rateRepository: typeof Rate
  ) {
    super()
  }

  /**
   * Get one
   * @param id 
   * @returns 
   */
  async getOne (id: string) {
    const rate = await this.rateRepository.findByPk<Rate>(id)

    if (!rate) {
      throw new HttpException('Rate not found.', HttpStatus.NOT_FOUND)
    }

    return new RateDto(rate)
  }

/**
 * update Rate
 * @param id 
 * @param request 
 */
  async updateRate (id: string, request : UpdateRateRequest) {
    const rate = await this.rateRepository.findByPk<Rate>(id)

    if (!rate) {
      throw new HttpException('Rate not found.', HttpStatus.NOT_FOUND)
    }
    if (request.inferenceRate) {
      rate.inferenceRate = Number(request.inferenceRate)
    }
    if (request.trainingRate) {
      rate.trainingRate = Number(request.trainingRate)
    }
    if (request.freeCredits) {
      rate.freeCredits = Number(request.freeCredits)
    }
    if (request.projectDefaultFee) {
      rate.projectDefaultFee = Number(request.projectDefaultFee)
    }
    if (request.datasetDefaultFee) {
      rate.datasetDefaultFee = Number(request.datasetDefaultFee)
    }
    await rate.save()
  }
}
