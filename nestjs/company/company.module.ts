import { CacheModule, Module } from '@nestjs/common'
import { DatabaseModule } from '../../db/database.module'
import { CompanyTeamController } from './controller/company-team.controller';
import { CompanyTeamService } from './service/company-team.service';
import { companyProviders } from './model/company.provider';
import { CompanyEmployeeController } from './controller/company-employee.controller';
import { CompanyEmployeeService } from './service/company-employee.service';

@Module({
  imports: [DatabaseModule, CacheModule.register()],
  controllers: [CompanyTeamController, CompanyEmployeeController],
  providers: [CompanyTeamService, CompanyEmployeeService, ...companyProviders],
  exports: [CompanyTeamService, CompanyEmployeeService]
})
export class CompanyModule {}
