import { CacheModule, Module } from '@nestjs/common'
import { DatabaseModule } from '../../db/database.module'
import { planProvider } from './model/plan.provider';
import { PlanService } from './service/plan.service';
import { RateController } from './controller/rate.controller';
import { RateService } from './service/rate.service';
import { PlanController } from './controller/plan.controller';
import { CreditController } from './controller/credit.controller';
import { CreditService } from './service/credit.service';
import { UsersModule } from '../users/users.module'
import { PaymentController } from './controller/payment.controller';
import { CreditPetitionController } from './controller/credit-petition.controller';
import { CreditPetitionService } from './service/credit-petition.service';
import { MailModule } from '../shared/module/mail.module';

@Module({
  imports: [DatabaseModule, CacheModule.register(), UsersModule, MailModule],
  controllers: [RateController, PlanController, CreditController, PaymentController, CreditPetitionController],
  providers: [PlanService, RateService, ...planProvider, CreditService, CreditPetitionService],
  exports: [PlanService, RateService, ...planProvider]
})
export class PlansModule {}
