import { Controller, Body, Post, Res, Logger } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import axios from 'axios';
import { config } from '../../../config';
import * as CryptoJS from 'crypto-js';
import { UserWalletService } from '../../users/service/user.wallet.service'
import { User } from '../../users/model/user.model';
import { Credit } from '../model/credit';
import { WalletUsageType } from '../../shared/enum/wallet-usage-type';

@Controller('fortpay')
@SkipThrottle()
@ApiBearerAuth()
@ApiTags('Payfort - Payment')
export class PaymentController {
  constructor (
    private readonly userWalletService: UserWalletService
  ) {
  }

  private readonly logger = new Logger(PaymentController.name)
  /**
   * Authorize the payment
   * @param req
   * @param request
   * @returns
   */

  @Post('/payment')
  async authorizePayment (@Res() res: Response, @Body() request: any) {
    try {
      if (request.response_message === 'Success' && request.command === 'AUTHORIZATION') {
        const refrence = request.merchant_reference.split('-');
        // Payload for the Authorize payment
        const payload = {
          command: config.fortpay.command,
          access_code: request.access_code,
          merchant_identifier: request.merchant_identifier,
          merchant_reference: request.merchant_reference,
          amount: request.amount,
          currency: request.currency,
          language: request.language,
          fort_id: request.fort_id,
          signature: await this.generateHash(request)
        }
        // Make the POST request to the API
        try {
          const response = await axios.post(config.fortpay.apiUrl, payload)
          // Handle the API response here
          // Replace this with your desired logic
          const planDetails = await Credit.findByPk(refrence[0])
          if (response.data.response_message === 'Success') {
            const walletPayload = {
              isAdd: true,
              value: planDetails.credit,
              sarValue: planDetails.credit,
              reason: `${request.order_description}. Transaction Id: ${request.fort_id}`
            }
            const user = await User.findOne({
              where: { email: request.customer_email, id: refrence[1] }
            })
            if (user) {
              await this.userWalletService.walletTopUp(
                user.id.toString(),
                walletPayload,
                user,
                WalletUsageType.purchased
              )
            }
            const redirectUrl = `${process.env.WEB_PORTAL_URL}/portal/account/balance?payment=success`
            res.redirect(redirectUrl);
          } else {
            const redirectUrl = `${process.env.WEB_PORTAL_URL}/portal/account/balance?payment=failed`
            res.redirect(redirectUrl)
          }
        } catch (error) {
          this.logger.warn('Axios Error:')
          this.logger.warn(error)
          const redirectUrl = `${process.env.WEB_PORTAL_URL}/portal/account/balance?payment=failed`
          res.redirect(redirectUrl)
        }
      } else if (request.response_message !== 'Success' && request.response_code === '00072') {
        const redirectUrl = `${process.env.WEB_PORTAL_URL}/portal/account/balance?payment=canceled`
        res.redirect(redirectUrl);
      } else {
        const redirectUrl = `${process.env.WEB_PORTAL_URL}/portal/account/balance?payment=failed`
        res.redirect(redirectUrl);
      }
    } catch (error) {
      const redirectUrl = `${process.env.WEB_PORTAL_URL}/portal/account/balance?payment=failed`
      res.redirect(redirectUrl);
    }
  }

  /**
   * This method is used to create signature for the payford payment
   * @param requestPhrase
   * @param request
   * @returns
   */

  async generateHash (request: any) {
    const data = `${config.fortpay.requestPhrase}access_code=${request.access_code}amount=${request.amount}command=${config.fortpay.command}currency=${request.currency}fort_id=${request.fort_id}language=enmerchant_identifier=${request.merchant_identifier}merchant_reference=${request.merchant_reference}${config.fortpay.requestPhrase}`;
    return CryptoJS.SHA256(data).toString()
  }
}
