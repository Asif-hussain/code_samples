import { CompanyTeam } from './company-team.model';
import { CompanyEmployee } from './company-employee.model';

export const companyProviders = [
  {
    provide: 'COMPANY_TEAM_REPOSITORY',
    useValue: CompanyTeam
  },
  {
    provide: 'COMPANY_EMPLOYEE_REPOSITORY',
    useValue: CompanyEmployee
  }
]
