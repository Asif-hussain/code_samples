import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../db/database.module'
import { CustomerService } from './service/customer.service'
import { userProviders } from '../users/model/user.provider'
import { UsersModule } from '../users/users.module'
import { CmsCustomerController } from './controller/cms-customer.controller'
import { WebCustomerController } from './controller/web-customer.controller'

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [CmsCustomerController, WebCustomerController],
  providers: [CustomerService, ...userProviders],
  exports: [CustomerService]
})
export class CustomerModule {}
