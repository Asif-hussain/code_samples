import { Module, CacheModule } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { BundlesController } from './controllers/bundles.controller';
import { bundlesProviders } from './model/bundles.provider';
import { BundlesService } from './services/bundles.service';
import { userProviders } from '../users/model/user.provider';
import { CustomersBundlesController } from './controllers/customers-bundles.controller';
import { CustomersBundlesService } from './services/customers-bundles.service';
import { UserBundleService } from './services/user-bundle.service';
import { CronBundlesService } from './cron/cron-bundles.service';
import { MailModule } from '../shared/module/mail.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, CacheModule.register(), MailModule, UsersModule],
  controllers: [BundlesController, CustomersBundlesController],
  providers: [BundlesService, CustomersBundlesService, UserBundleService, CronBundlesService, ...bundlesProviders, ...userProviders],
  exports: [BundlesService, UserBundleService]
})
export class BundlesModule {}
