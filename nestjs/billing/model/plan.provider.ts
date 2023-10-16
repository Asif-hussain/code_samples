import { Plan } from './plan';
import { UserPlan } from './user.plan';
import { Rate } from './rate';
import { Credit } from './credit';

export const planProvider = [
  {
    provide: 'PLAN_REPOSITORY',
    useValue: Plan
  },
  {
    provide: 'USER_PLAN_REPOSITORY',
    useValue: UserPlan
  },
  {
    provide: 'RATE_REPOSITORY',
    useValue: Rate
  },
  {
    provide: 'CREDIT_REPOSITORY',
    useValue: Credit
  }
]
